"use client";
import {
  EmptyView,
  EntitItem,
  EntityContainer,
  EntityHeader,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-component";
import type { ReactNode } from "react";
import { Execution } from "@/generated/prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-execution-params";
import {
  CheckCircle2Icon,
  ClockIcon,
  LoaderIcon,
  XCircleIcon,
} from "lucide-react";

export const ExecutionsList = () => {
  const executionsList = useSuspenseExecutions();

  return (
    <EntityList
      items={executionsList.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem execution={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

const ExecutionsHeader = () => {
  return (
    <>
      <EntityHeader
        title="Executions"
        description="View your workflow executions history"
      />
    </>
  );
};

const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      page={executions.data.page}
      totalPages={executions.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading Executions ..." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error loading executions" />;
};

export const ExecutionsEmpty = () => {
  return (
    <EmptyView message="You haven't created any execution yet. Get started by running your first workflow" />
  );
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return <CheckCircle2Icon className="size-5 text-green-600 " />;
    case "FAILED":
      return <XCircleIcon className="size-5 text-red-600 " />;
    case "RUNNING":
      return <LoaderIcon className="size-5 text-blue-600 animate-spin" />;

    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatExecutionStatus = (status: string) => {
  return status[0]?.toUpperCase() + status.slice(1)?.toLowerCase();
};

export const ExecutionItem = ({
  execution,
}: {
  execution: Execution & { workflow: { id: string; name: string } };
}) => {
  const duration = execution.completedAt
    ? Math.round(
        new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime(),
      ) / 1000
    : null;

  const subTitle = (
    <>
      {execution.workflow.name} &bull; Started:{" "}
      {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s</>}
    </>
  );

  return (
    <EntitItem
      href={`/executions/${execution.id}`}
      title={formatExecutionStatus(execution.status)}
      subTitle={subTitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(execution.status)}
        </div>
      }
    />
  );
};
