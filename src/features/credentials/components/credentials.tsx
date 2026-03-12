"use client";
import {
  EmptyView,
  EntitItem,
  EntityContainer,
  EntityHeader,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-component";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "../hooks/use-entity-search";
import type { Credential } from "@/generated/prisma/client";
import { GoWorkflow } from "react-icons/go";
import { formatDistanceToNow } from "date-fns";
import { useCredentialsParams } from "../hooks/use-credential-params";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";

const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      placeholder="Search credential"
      onChange={onSearchChange}
    />
  );
};

export const CredentialList = () => {
  const credentialList = useSuspenseCredentials();

  return (
    <EntityList
      items={credentialList.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem credential={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

const CredentialsHeder = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Credentials"
        description="Create and manage Credentials"
        search={<CredentialsSearch />}
        newButtonHref="/credentials/new"
        newButtonLabel="New Credential"
        disabled={disabled}
      />
    </>
  );
};

const CredentialPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      page={credentials.data.page}
      totalPages={credentials.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<CredentialsHeder />}
      pagination={<CredentialPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading Credentials ..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error loading Credentials" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const createNewCredential = async () => {
    router.push(`/credentials/new`);
  };

  return (
    <>
      <EmptyView
        title="Create your first Credential"
        message="You have not created any credential yet. Get started by creating your first credential"
        buttonLabel="New credential"
        onNew={createNewCredential}
      />
    </>
  );
};

export const CredentialItem = ({ credential }: { credential: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemoveCredential = () =>
    removeCredential.mutate({ id: credential.id });

  return (
    <EntitItem
      href={`/credentials/${credential.id}`}
      title={credential.name}
      subTitle={
        <div className="flex gap-x-2">
          <span>
            Updated{" "}
            {formatDistanceToNow(credential.updatedAt, { addSuffix: true })}
          </span>
          <span>&bull;</span>
          <span>
            Created{" "}
            {formatDistanceToNow(credential.createdAt, { addSuffix: true })}
          </span>
        </div>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <GoWorkflow className="size-5! text-muted-foreground" />
        </div>
      }
      onRemove={handleRemoveCredential}
      isRemoving={removeCredential.isPending}
    />
  );
};
