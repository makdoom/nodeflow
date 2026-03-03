"use client";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-component";
import {
  useSuspenseCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import type { ReactNode } from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "../hooks/use-entity-search";

const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      placeholder="Search workflows"
      onChange={onSearchChange}
    />
  );
};

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
        search={<WorkflowsSearch />}
        onNew={createNewWorkflow}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

const WorkflowPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      page={workflows.data.page}
      totalPages={workflows.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeder />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};
