"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-component";
import {
  useSuspenseCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { ReactNode } from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export const WorkflowsList = () => {
  const workflowsList = useSuspenseWorkflows();

  return (
    <div className="flex flex-1 justify-center items-center">
      {JSON.stringify(workflowsList.data, null, 2)}
    </div>
  );
};

const WorkflowsHeder = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();

  const createWorkflow = useSuspenseCreateWorkflow();
  const { modal, handleError } = useUpgradeModal();

  const createNewWorkflow = async () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage worflows"
        search={<></>}
        onNew={createNewWorkflow}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer header={<WorkflowsHeder />} pagination={<></>}>
      {children}
    </EntityContainer>
  );
};
