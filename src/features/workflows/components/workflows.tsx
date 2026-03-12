"use client";
import {
  EmptyView,
  EntitItem,
  EntityContainer,
  EntityHeader,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-component";
import {
  useRemoveWorkflow,
  useSuspenseCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import type { ReactNode } from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma/client";
import { GoWorkflow } from "react-icons/go";
import { formatDistanceToNow } from "date-fns";

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
    <EntityList
      items={workflowsList.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
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
        description="Create and manage workflows"
        search={<WorkflowsSearch />}
        onNew={createNewWorkflow}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

const WorkflowsPagination = () => {
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

export const WorkflowsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeder />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading workflows ..." />;
};

export const WorkflowsError = () => {
  return <ErrorView message="Error loading workflows" />;
};

export const WorkflowsEmpty = () => {
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
      <EmptyView
        title="Create your first workflow"
        message="You have not created any workflowss yet. Get started by creating your first workflow"
        buttonLabel="New Workflow"
        onNew={createNewWorkflow}
        disabled={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowItem = ({ workflow }: { workflow: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemoveWorkflow = () => removeWorkflow.mutate({ id: workflow.id });

  return (
    <EntitItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subTitle={
        <div className="flex gap-x-2">
          <span>
            Updated{" "}
            {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}
          </span>
          <span>&bull;</span>
          <span>
            Created{" "}
            {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
          </span>
        </div>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <GoWorkflow className="size-5! text-muted-foreground" />
        </div>
      }
      onRemove={handleRemoveWorkflow}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
