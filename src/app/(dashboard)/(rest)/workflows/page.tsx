import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();

  return <div>Workflows</div>;
};
export default Page;
