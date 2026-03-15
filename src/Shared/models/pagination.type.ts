export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export type TPaginationParams = {
  page: number;
  limit: number;
  q: string;
  sortField: string;
  sortOrder: SortOrder;
};

export type TPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
