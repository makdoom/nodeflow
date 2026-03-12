import { CredentialForm } from "@/features/credentials/components/credential-form";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    <div className="p-3 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-3xl w-full flex flex-col h-full gap-y-8">
        <CredentialForm />
      </div>
    </div>
  );
};

export default Page;
