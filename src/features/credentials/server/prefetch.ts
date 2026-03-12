import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.credentials.getMany>;

// Prefetch credentials for a user
export const prefetchCredentials = async (params: Input) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

// Prefetch for single credential
export const prefetchCredential = async (id: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};
