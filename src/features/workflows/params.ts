import { PAGINATION } from "@/config/constant";
import { parseAsInteger, parseAsString } from "nuqs/server";

export const workflowParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),

  pagesize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),

  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
