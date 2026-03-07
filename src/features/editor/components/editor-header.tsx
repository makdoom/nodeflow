"use client";

import { ModeToggle } from "@/components/dark-mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { editorAtom } from "../stores/atom";

const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleSave = () => {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  };

  return (
    <Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
      <IoSaveOutline />
      Save
    </Button>
  );
};

const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflowName = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (name == workflow.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflowName.mutateAsync({ id: workflow.id, name });
    } catch (error) {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      handleSave();
    } else if (e.key == "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (workflow) setName(workflow.name);
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={updateWorkflowName.isPending}
        className="h-7 w-auto min-w-25 px-2"
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};
const EditorBreadcrumb = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/workflows">Workflows</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="flex h-14 w-full shrink-0 border-b gap-2 bg-background px-4 items-center justify-between">
      <div className="flex items-center gap-x-4 w-full">
        <SidebarTrigger />
        <div className="flex items-center justify-between w-full gap-x-4">
          <EditorBreadcrumb workflowId={workflowId} />
          <EditorSaveButton workflowId={workflowId} />
        </div>
      </div>
      <ModeToggle />
    </header>
  );
};

export default EditorHeader;
