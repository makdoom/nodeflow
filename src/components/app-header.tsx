import { SidebarTrigger } from "./ui/sidebar";

const AppHeader = () => {
  return (
    <header className="flex h-14 shrink-0 border-b gap-2 bg-background px-4 items-center">
      <SidebarTrigger />
    </header>
  );
};
export default AppHeader;
