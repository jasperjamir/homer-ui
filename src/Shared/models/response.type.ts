import type { TPagination } from "./pagination.type";

export type TResponse<T> = {
  data: T;
  message?: string;
};

export type TPaginationResponse<T> = {
  data: T[];
  pagination: TPagination;
  message?: string;
};
