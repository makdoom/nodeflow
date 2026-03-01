import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-3">
        <h2 className="flex items-center justify-center text-2xl font-bold text-primary ">
          Nodeflow
        </h2>
        {children}
      </div>
    </div>
  );
};
export default AuthLayout;
