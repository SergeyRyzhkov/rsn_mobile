import { initializeApp } from "firebase/app";
import type {
  FullMetadata,
  ListOptions,
  SettableMetadata,
  TaskState,
  UploadMetadata,
  UploadTaskSnapshot,
} from "firebase/storage";

import {
  getBlob,
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  list,
  listAll,
  ref,
  updateMetadata,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7klK5S_eb2OyI6RhcjzkD6r9QLNskyNM",
  authDomain: "rsn-ro.firebaseapp.com",
  projectId: "rsn-ro",
  storageBucket: "rsn-ro.appspot.com",
  messagingSenderId: "897494097867",
  appId: "1:897494097867:web:35db20f6da4f1916e3204e",
  measurementId: "G-HC4L0ND68B",
};

const app = initializeApp(firebaseConfig);

export interface ListFilesOptions {
  path: string;
  maxResults?: number;
  pageToken?: string;
}

export interface ListFilesResult {
  items: StorageReference[];
  nextPageToken?: string;
}

export interface StorageReference {
  bucket: string;
  path: string;
  name: string;
}

export type UploadFileCallback = (event: UploadFileCallbackEvent | null, error: any) => void;

export interface UploadFileCallbackEvent {
  progress: number;
  bytesTransferred?: number;
  totalBytes?: number;
  completed: boolean;
  state: TaskState;
}

export class FirebaseStorage {
  public static readonly ERROR_BLOB_MISSING = "blob must be provided.";

  private getAppStorage() {
    return getStorage(app);
  }

  public async deleteFile(path: string): Promise<void> {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  public async getDownloadUrl(path: string): Promise<string> {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }

  public async getMetadata(path: string): Promise<FullMetadata> {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, path);
    return await getMetadata(storageRef);
  }

  //TODO:
  //   useEffect(() => {
  //   listAll(imageListRef.current).then(async (response) => {
  //     const promises = response.items.map((item) => getDownloadURL(item));
  //     const urls = await Promise.all(promises);
  //     setImageList(urls);
  //   })
  // }, []);

  //TODO: Еще опционально метадата и getDownloadUrl
  // А пагинация нужна? Может listAll
  public async listFiles(options: ListFilesOptions): Promise<ListFilesResult> {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, options.path);
    const listOptions: ListOptions = {
      maxResults: options.maxResults,
      pageToken: options.pageToken,
    };
    const listResult = await list(storageRef, listOptions);
    const result: ListFilesResult = {
      items: listResult.items.map((item) => ({
        bucket: item.bucket,
        name: item.name,
        path: item.fullPath,
      })),
    };
    if (listResult.nextPageToken) {
      result.nextPageToken = listResult.nextPageToken;
    }
    return result;
  }

  public async updateMetadata(path: string, metadata: SettableMetadata): Promise<void> {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, path);
    await updateMetadata(storageRef, metadata);
  }

  // TODO: + getDownloadUrl in result
  public async uploadFile(path: string, blob: Blob, metadata?: UploadMetadata, callback?: UploadFileCallback) {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    if (!!callback) {
      uploadTask.on("state_changed", {
        next: (snapshot) => {
          const result = this.createUploadFileCallbackEvent(snapshot);
          callback(result, undefined);
        },
        error: (error) => {
          callback(null, error);
        },
        complete: () => {
          const result = this.createUploadFileCallbackEvent(uploadTask.snapshot);
          callback(result, undefined);
        },
      });
    }
    return uploadTask;
  }

  public getBlob(path: string) {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, path);
    return getBlob(storageRef);
  }

  public getBasketSize() {
    return this.getFolderSize();
  }

  public async getFolderSize(folderPath?: string) {
    const resObj = {
      size: 0,
    };
    await this.getFolderSizeRecursive(resObj, folderPath);
    return resObj.size;
  }

  private async getFolderSizeRecursive(sizeObj: { size: number }, folderPath?: string) {
    const storage = this.getAppStorage();
    const folderRef = ref(storage, folderPath);

    const list = await listAll(folderRef);

    for (const fileRef of list.items) {
      sizeObj.size = sizeObj.size + (await this.getMetadata(fileRef.fullPath)).size;
    }

    for (const folderRef of list.prefixes) {
      console.log("folderRef", folderRef);
      await this.getFolderSizeRecursive(sizeObj, folderRef.fullPath);
    }
  }

  private createUploadFileCallbackEvent(snapshot: UploadTaskSnapshot): UploadFileCallbackEvent {
    const result: UploadFileCallbackEvent = {
      progress: snapshot.bytesTransferred / snapshot.totalBytes,
      bytesTransferred: snapshot.bytesTransferred,
      totalBytes: snapshot.totalBytes,
      completed: snapshot.state === "success",
      state: snapshot.state,
    };
    return result;
  }
}
