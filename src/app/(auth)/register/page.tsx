import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
};
export default Page;
