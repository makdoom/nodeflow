"use client";

import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { memo, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
          <Button
            onClick={() => {}}
            size="icon"
            variant="outline"
            className="bg-background"
          >
            <IoIosAddCircleOutline size={18} />
          </Button>
        </NodeSelector>
      </TooltipTrigger>
      <TooltipContent side="left">Add New Node</TooltipContent>
    </Tooltip>
  );
});

AddNodeButton.displayName = "AddNodeButton";
