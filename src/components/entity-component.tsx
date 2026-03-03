import Link from "next/link";
import { Button } from "./ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type EntityHeaderProps = {
  title: string;
  description?: string;
  search?: ReactNode;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { newButtonHref?: never; onNew?: never }
);

export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-xl md:text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled={isCreating || disabled} onClick={onNew}>
              <IoIosAddCircleOutline className="size-4.5!" />
              <span className="text-xs">{newButtonLabel}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create new workflow</TooltipContent>
        </Tooltip>
      )}

      {newButtonHref && !onNew && (
        <Button size="sm" asChild>
          <Link href={newButtonHref} prefetch>
            <IoIosAddCircleOutline size={20} />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: ReactNode;
  header: ReactNode;
  pagination: ReactNode;
};
export const EntityContainer = ({
  children,
  header,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-3 md:px-5 md:py-5 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col h-full gap-y-4">
        {header}

        <div className="flex flex-col h-full gap-y-2.5">{children}</div>
        {pagination}
      </div>
    </div>
  );
};
