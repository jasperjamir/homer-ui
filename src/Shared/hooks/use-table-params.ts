/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Filters Complex logic> */
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import { SortOrder } from "@/Shared/models";
import { getIntParam, getStringParam } from "@/Shared/utils/url-params.util";

type UseTableParamsOptions<TFilters> = {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSortField?: string;
  defaultSortOrder?: "asc" | "desc";
  extraFilters?: (searchParams: URLSearchParams) => TFilters;
};

export function useTableParams<TFilters extends Record<string, unknown> = Record<string, never>>(
  options: UseTableParamsOptions<TFilters> = {},
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = getIntParam(searchParams, "page", options.defaultPage ?? 1);
  const limit = getIntParam(searchParams, "limit", options.defaultLimit ?? 10);
  const q = getStringParam(searchParams, "q") ?? "";
  const sortField = getStringParam(searchParams, "sortField") ?? options.defaultSortField;
  const sortOrder =
    (getStringParam(searchParams, "sortOrder") as "asc" | "desc") ?? options.defaultSortOrder;

  const filters = useMemo(() => {
    return options.extraFilters ? options.extraFilters(searchParams) : ({} as TFilters);
  }, [searchParams, options.extraFilters]);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: limit,
    }),
    [page, limit],
  );

  const sorting: SortingState = useMemo(() => {
    if (!sortField) return [];
    return [{ id: sortField, desc: sortOrder === SortOrder.DESC }];
  }, [sortField, sortOrder]);

  const setPagination = useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      setSearchParams(
        (prev) => {
          const oldState = {
            pageIndex: getIntParam(prev, "page", 1) - 1,
            pageSize: getIntParam(prev, "limit", 10),
          };
          const newState =
            typeof updaterOrValue === "function" ? updaterOrValue(oldState) : updaterOrValue;

          const newParams = new URLSearchParams(prev);
          newParams.set("page", (newState.pageIndex + 1).toString());
          newParams.set("limit", newState.pageSize.toString());
          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSorting = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      setSearchParams(
        (prev) => {
          const sortField = getStringParam(prev, "sortField");
          const sortOrder = getStringParam(prev, "sortOrder") as "asc" | "desc";
          const oldState: SortingState = sortField
            ? [{ id: sortField, desc: sortOrder === SortOrder.DESC }]
            : [];

          const newState =
            typeof updaterOrValue === "function" ? updaterOrValue(oldState) : updaterOrValue;

          const newParams = new URLSearchParams(prev);
          if (newState.length > 0) {
            newParams.set("sortField", newState[0].id);
            newParams.set("sortOrder", newState[0].desc ? SortOrder.DESC : SortOrder.ASC);
          } else {
            newParams.delete("sortField");
            newParams.delete("sortOrder");
          }
          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSearch = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (value) {
            newParams.set("q", value);
          } else {
            newParams.delete("q");
          }
          newParams.set("page", "1");
          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setFilters = useCallback(
    (newFilters: Partial<TFilters>) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          Object.entries(newFilters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "all") {
              newParams.delete(key);
            } else {
              newParams.set(key, String(value));
            }
          });
          newParams.set("page", "1");
          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams();
        // Preserve only limit if wanted, or reset to default
        const limit = prev.get("limit");
        if (limit) newParams.set("limit", limit);
        newParams.set("page", "1");
        return newParams;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return {
    pagination,
    sorting,
    apiParams: {
      page,
      limit,
      q,
      sortField,
      sortOrder,
      ...filters,
    },
    search: q,
    filters,
    setPagination,
    setSorting,
    setSearch,
    setFilters,
    clearFilters,
  };
}
