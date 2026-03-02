import AppHeader from "@/components/app-header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
};
export default Layout;
