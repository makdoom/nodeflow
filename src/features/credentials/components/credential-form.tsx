"use client";

import { CredentialType } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { CredentialsError, CredentialsLoading } from "./credentials";

type CredentialFormProps = {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
};

const credentialTypeOptions = [
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/logos/gemini-icon.svg",
  },
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/logos/openai-white-icon.svg",
  },
  {
    value: CredentialType.ANTHROPIC,
    label: "Anthropic",
    logo: "/logos/anthropic-icon.svg",
  },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.GEMINI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync(
        {
          id: initialData.id,
          ...values,
        },
        {
          onSuccess: () => {
            router.push(`/credentials`);
          },
        },
      );
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: () => {
          router.push(`/credentials`);
        },
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };

  return (
    <>
      {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Credentials" : "Create Credentials"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Update your API key or credential details"
              : "Add a new API key or credentials to you account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        autoFocus
                        aria-invalid={fieldState.invalid}
                        placeholder="eg: My API key"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>

              <Field>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel htmlFor="type">Type</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          className="min-w-30"
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {credentialTypeOptions.map((option) => (
                            <SelectItem value={option.value} key={option.value}>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={option.logo}
                                  alt={option.label}
                                  width={16}
                                  height={16}
                                />
                                {option.label}
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
              </Field>

              <Field>
                <Controller
                  name="value"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel htmlFor="value">API Key</FieldLabel>
                      <Input
                        {...field}
                        id="value"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="eg: sk-........ "
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>

              <div className="flex gap-4 justify-end">
                <Button disabled={false} variant="outline" asChild>
                  <Link href="/credentials" prefetch>
                    Cancel
                  </Link>
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createCredential.isPending || updateCredential.isPending
                  }
                >
                  {isEdit ? "Update Credentials" : "Save Credentials"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
};
