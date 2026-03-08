// "use client";
import { ModeToggle } from "./dark-mode-toggle";
import { SidebarTrigger } from "./ui/sidebar";

const AppHeader = () => {
  return (
    <header className="flex h-14 w-full shrink-0 border-b gap-2 bg-background px-4 items-center justify-between">
      <SidebarTrigger />
      <ModeToggle />
    </header>
  );
};
export default AppHeader;
