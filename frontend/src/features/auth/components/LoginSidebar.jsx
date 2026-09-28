import { memo } from "react";
import { ProgramSelector } from "@/features/sidebar";

function LoginSidebarComponent() {
  return (
    <aside className="w-full sm:w-lg h-full select-none md:border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col relative overflow-hidden">
      <ProgramSelector />
    </aside>
  );
}

export const LoginSidebar = memo(LoginSidebarComponent);
export default LoginSidebar;
