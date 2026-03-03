import Link from "next/link";
import { Button } from "./ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

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
  search,
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
      {search && search}
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

type EntitySearchProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export const EntitySearch = ({
  value,
  placeholder,
  onChange,
}: EntitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="max-w-50 bg-background border-border pl-8"
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          disabled={page == 1 || disabled}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={page == totalPages || disabled || totalPages == 0}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
