// import { filename } from "pathe/utils";
// import { computed } from "#build/imports";

// interface ImagesComposable {
//   getImageSrc: (fileName: string) => string | undefined;
// }

// function useImages(): ImagesComposable {
//   // TODO : replace the first parameter of the glob function according to your needs, I needed to import only png and jpeg from the images directory.
//   const images = computed(() => import.meta.glob("~/assets/images/*.(png|jpeg)", { eager: true }));

//   const getImageSrc = (fileName: string): string | undefined => {
//     for (const path in images.value) {
//       if (Object.hasOwn(images.value, path)) {
//         // unknown type is required here to change the final type as typescript thinks that images.value[path] is a function, it is not.
//         const image: unknown = images.value[path];
//         const imagePath = (image as { default: string }).default;
//         if (filename(imagePath) === filename(fileName)) {
//           return imagePath;
//         }
//       }
//     }
//     return undefined;
//   };
//   return { getImageSrc };
// }

// export { useImages };

// // USAGE => const src = getImageSrc("test.png")
