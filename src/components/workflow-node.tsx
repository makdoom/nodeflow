"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { IoSettingsOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";

type WorkflowNodeProps = {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSetting?: () => void;
  name?: string;
  description?: string;
};

export const WorkflowNode = ({
  children,
  showToolbar = true,
  onDelete,
  onSetting,
  name,
  description,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button variant="ghost" size="sm" onClick={onSetting}>
            <IoSettingsOutline />
          </Button>

          <Button variant="ghost" size="sm" onClick={onDelete}>
            <IoTrashOutline />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-50 text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-muted-foreground truncate text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
