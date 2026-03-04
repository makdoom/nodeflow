"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { memo } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

export const AddNodeButton = memo(() => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => {}}
          size="icon"
          variant="outline"
          className="bg-background"
        >
          <IoIosAddCircleOutline size={18} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">Add New Node</TooltipContent>
    </Tooltip>
  );
});

AddNodeButton.displayName = "AddNodeButton";
