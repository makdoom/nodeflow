import { LuMousePointer2 } from "react-icons/lu";
import { IoGlobeOutline } from "react-icons/io5";
import { NodeType } from "@/generated/prisma/enums";
import { ComponentType, ReactNode, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Runs the flow by clicking manually",
    icon: LuMousePointer2,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form Trigger",
    description: "Runs the flow when a Google Form is submitted",
    icon: "/logos/google-form.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: IoGlobeOutline,
  },
];

type NodeSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export const NodeSelector = ({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selectedNode: NodeTypeOption) => {
      // First check is there any manual trigger exists
      if (selectedNode.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );

        if (hasManualTrigger) {
          toast.error("Only one manual trigger allowd per workflow");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type == NodeType.INITIAL,
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selectedNode.type,
        };

        return hasInitialTrigger ? [newNode] : [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, screenToFlowPosition, onOpenChange],
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-sm overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>What trigger this wokflow</SheetTitle>
            <SheetDescription>
              A trigger is a step that starts your wofflow
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            {triggerNodes.map((nodeType) => {
              const Icon = nodeType.icon;

              return (
                <div
                  key={nodeType.type}
                  className="h-auto w-full flex cursor-pointer justify-start px-4"
                  onClick={() => handleNodeSelect(nodeType)}
                >
                  <div className="flex items-center gap-6 w-full overflow-hidden">
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-5 object-contain rounded-sm"
                      />
                    ) : (
                      <Icon className="size-5" />
                    )}

                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium text-sm">
                        {nodeType.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {nodeType.description}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            {executionNodes.map((nodeType) => {
              const Icon = nodeType.icon;

              return (
                <div
                  key={nodeType.type}
                  className="h-auto w-full flex cursor-pointer justify-start px-4"
                  onClick={() => handleNodeSelect(nodeType)}
                >
                  <div className="flex items-center gap-6 w-full overflow-hidden">
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-5 object-contain rounded-sm"
                      />
                    ) : (
                      <Icon className="size-5" />
                    )}

                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium text-sm">
                        {nodeType.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {nodeType.description}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
