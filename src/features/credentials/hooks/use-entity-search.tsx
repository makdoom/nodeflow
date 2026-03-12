import { PAGINATION } from "@/config/constant";
import { useEffect, useState } from "react";

type ParamsType = {
  search: string;
  page: number;
};

interface UseEntitySearchProps<T extends ParamsType> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export const useEntitySearch = <T extends ParamsType>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) => {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({ ...params, search: "", page: PAGINATION.DEFAULT_PAGE });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams, debounceMs]);

  useEffect(() => setLocalSearch(params.search), [params.search]);

  return { searchValue: localSearch, onSearchChange: setLocalSearch };
};
