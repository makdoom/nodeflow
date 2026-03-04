"use client";

import { ErrorView, LoadingView } from "@/components/entity-component";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => <LoadingView message="Loading editor ..." />;
export const EditorError = () => (
  <ErrorView message="Error loading editor ..." />
);

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  return <p>{JSON.stringify(workflow, null, 2)}</p>;
};
