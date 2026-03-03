import Link from "next/link";
import { Button } from "./ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { IoFolderOpenOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
      <div className="mx-auto max-w-7xl w-full flex flex-col h-full gap-y-8">
        {header}

        <div className="flex flex-1 flex-col gap-y-2.5 h-full w-full">
          {children}
        </div>
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
    <div className="relative ml-auto bg-background">
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

type StateViewProps = {
  message?: string;
};

type LoadingViewProps = StateViewProps & {
  entity?: string;
};

export const LoadingView = ({ message }: LoadingViewProps) => {
  return (
    <div className="flex items-center justify-center flex-col h-full gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex items-center justify-center flex-col h-full gap-y-4">
      <AlertTriangleIcon className="size-6 text-destructive" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

type EmptyViewProps = StateViewProps & {
  title?: string;
  onNew?: () => void;
  buttonLabel?: string;
  disabled?: boolean;
};

export const EmptyView = ({
  title,
  buttonLabel,
  message,
  onNew,
  disabled,
}: EmptyViewProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10 size-12">
          <IoFolderOpenOutline className="text-primary" />
        </EmptyMedia>
        {!!title && <EmptyTitle>{title}</EmptyTitle>}
        {!!message && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyHeader>

      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew} disabled={disabled}>
            <IoIosAddCircleOutline className="size-4.5!" />
            <p className="text-xs">{buttonLabel}</p>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

type EntityListPropType<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: ReactNode;
  className?: string;
};

export const EntityList = <T extends {}>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListPropType<T>) => {
  if (!items.length && emptyView) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

type EntityItemProps = {
  title: string;
  href: string;
  subTitle?: ReactNode;
  image?: ReactNode;
  actions?: ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
};

export const EntitItem = ({
  title,
  href,
  subTitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;
    if (onRemove) await onRemove();
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer w-full",
          isRemoving && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              {!!subTitle && (
                <CardDescription className="text-xs text-muted-foreground">
                  {subTitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex gap-x-4 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem onClick={handleRemove}>
                      <TrashIcon className="size-4 text-destructive" />
                      <span className="text-destructive">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
