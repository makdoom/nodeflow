"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[A-Za-z_][A-Za-z0-9_]*$/, {
      message:
        "Variable name must start with a letter or underscores and contain only letters, numbers and underscores",
    }),
  credentialId: z.string().min(1, "Credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

type PropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
};

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: PropsType) => {
  const { data: credentials, isLoading: isLoadingCredential } =
    useCredentialByType(CredentialType.GEMINI);

  console.log({ credentials });
  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "",
      credentialId: defaultValues.credentialId ?? "",
      systemPrompt: defaultValues.systemPrompt ?? "",
      userPrompt: defaultValues.userPrompt ?? "",
    },
  });

  const variableName = form.watch("variableName") || "gemini";

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName ?? "",
        systemPrompt: defaultValues.systemPrompt ?? "",
        credentialId: defaultValues.credentialId ?? "",
        userPrompt: defaultValues.userPrompt ?? "",
      });
    }
  }, [open, form, defaultValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI modal and prompt for this node
          </DialogDescription>
        </DialogHeader>

        <form className="mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="variableName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="variableName">Variable Name</FieldLabel>
                  <Input
                    {...field}
                    id="variableName"
                    aria-invalid={fieldState.invalid}
                    placeholder="eg: gemini"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${variableName}.text}}`}
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              name="credentialId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="type">Gemini Credential</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isLoadingCredential || !credentials?.length}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Select a Credential" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {credentials?.map((credential) => (
                        <SelectItem value={credential.id} key={credential.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={"/logos/gemini-icon.svg"}
                              alt={credential.name}
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="systemPrompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="system-prompt">
                    System Prompt (Optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="system-prompt"
                      placeholder="You are a helpful assistant"
                      rows={8}
                      className="min-h-28 resize-none font-mono text-sm"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  <FieldDescription>
                    Sets the behavior of the assistant. Use{" "}
                    <code>{"{{variables}}"}</code> for simple values or{" "}
                    <code>{"{{json variables}}"}</code> to stringify objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="userPrompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-prompt">User Prompt</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="user-prompt"
                      placeholder="Summarize this text {{json httpResponse.data}}"
                      rows={8}
                      className="min-h-40 resize-none font-mono text-sm"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  <FieldDescription>
                    The prompt to send to the AI. Use{" "}
                    <code>{"{{variables}}"}</code> for simple values or{" "}
                    <code>{"{{json variables}}"}</code> to stringify objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
