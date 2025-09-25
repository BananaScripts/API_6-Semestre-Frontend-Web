import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  MessageSquare, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    description: "Insights e Analytics"
  },
  {
    title: "Chat IA",
    url: "/chat",
    icon: MessageSquare,
    description: "Conversas Inteligentes"
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: User,
    description: "Sua Conta"
  }
];

const adminItems = [
  {
    title: "Administração",
    url: "/admin",
    icon: Settings,
    description: "Gestão do Sistema"
  }
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavClasses = (path: string) => 
    isActive(path) 
      ? "bg-blue-dark/20 text-blue-dark border-r-2 border-blue-dark font-semibold" 
      : "hover:bg-accent/50 smooth-transition";

  const allItems = user?.role === 'admin' 
    ? [...navigationItems, ...adminItems]
    : navigationItems;

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} smooth-transition border-r border-border/50`}>
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-dark to-blue-dark-hover rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Akasys</h2>
                <p className="text-xs text-muted-foreground">Business Intelligence</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 hover:bg-accent/50"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-muted-foreground text-xs font-medium mb-2"}>
            NAVEGAÇÃO
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {allItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg smooth-transition ${getNavClasses(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="bg-gradient-to-r from-blue-dark/10 to-golden/10 p-3 rounded-lg">
              <p className="text-xs font-medium text-foreground">Status do Sistema</p>
              <p className="text-xs text-muted-foreground">Conectado • Dados atualizados</p>
              <div className="mt-2 w-full bg-muted rounded-full h-1">
                <div className="bg-blue-dark h-1 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}