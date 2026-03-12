import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflows.getMany>;

// Prefetch workflows for a user
export const prefetchworkflowss = async (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

// Prefetch for single workflow
export const prefetchworkflows = async (id: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
