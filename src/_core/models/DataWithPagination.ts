import { PaginationModel } from "./PaginationModel";

export class DataWithPagination<T> {
  data: T[] = [];
  pagination = new PaginationModel();
  seo: { [key: string]: string } = {};
}
