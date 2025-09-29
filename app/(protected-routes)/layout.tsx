import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const ProtectedRoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="overflow-y-hidden w-full">
          <SidebarTrigger className="bg-slate-200 m-2" />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
};

export default ProtectedRoutesLayout;
