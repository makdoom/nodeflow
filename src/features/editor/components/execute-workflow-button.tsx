import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { MonitorCogIcon } from "lucide-react";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecuteWorkflow = () => {
    executeWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button
      size="lg"
      onClick={handleExecuteWorkflow}
      disabled={executeWorkflow.isPending}
    >
      <MonitorCogIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
