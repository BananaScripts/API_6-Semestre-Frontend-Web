import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { useAuth } from "@/hooks/use-auth";

export function AppLayout() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bi-gradient">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="container mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}