import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  Menu,
  X,
  Bell,
  CheckCircle,
  LogOut,
  Clock
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useReservations } from "@/hooks/useReservations";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { 
    title: "Calendrier", 
    url: "/admin", 
    icon: Calendar,
    description: "Vue calendrier des réservations confirmées"
  },
  { 
    title: "Nouvelles réservations", 
    url: "/admin/reservations?tab=new", 
    icon: Bell,
    description: "Réservations en attente de confirmation",
    badge: true
  },
  { 
    title: "Réservations confirmées", 
    url: "/admin/reservations?tab=confirmed", 
    icon: CheckCircle,
    description: "Réservations validées et planifiées"
  },
  { 
    title: "Gestion des horaires", 
    url: "/admin/schedule", 
    icon: Clock,
    description: "Gérer vos disponibilités"
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { reservations } = useReservations();
  const { state, setOpenMobile, openMobile } = useSidebar();
  const currentPath = location.pathname + location.search;

  // Count pending reservations for badge
  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  const isActive = (path: string) => {
    if (path.includes('?tab=new') && location.search.includes('tab=new')) return true;
    if (path.includes('?tab=confirmed') && location.search.includes('tab=confirmed')) return true;
    if (path === '/admin' && location.pathname === '/admin' && !location.search) return true;
    if (path === '/admin/schedule' && location.pathname === '/admin/schedule') return true;
    return false;
  };

  const getNavCls = (itemUrl: string) => {
    const active = isActive(itemUrl);
    return active 
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Déconnecté",
        description: "Vous avez été déconnecté avec succès"
      });
    }
  };

  const handleNavClick = () => {
    // Fermer le menu mobile quand on clique sur un lien
    if (openMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {openMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setOpenMobile(false)}
        />
      )}
      
      <Sidebar className="bg-white border-r border-gray-200 z-50">
        <SidebarContent className="bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-primary">MonHygiène</h2>
                <p className="text-xs text-muted-foreground hidden sm:block">Panel d'administration</p>
              </div>
              
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMobile(false)}
                className="h-8 w-8 lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <SidebarGroup className="px-3 py-4 bg-white">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        onClick={handleNavClick}
                        className={`${getNavCls(item.url)} flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 group relative`}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <item.icon className="h-5 w-5 shrink-0" />
                          <div className="ml-3 flex-1 min-w-0">
                            <span className="font-medium text-sm block truncate">{item.title}</span>
                            <p className="text-xs opacity-70 mt-0.5 hidden sm:block truncate">{item.description}</p>
                          </div>
                        </div>
                        
                        {item.badge && pendingCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-2 h-5 min-w-[20px] flex items-center justify-center text-xs px-1.5 shrink-0"
                          >
                            {pendingCount}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200 mt-auto bg-white">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">En attente:</span>
                <Badge variant="outline" className="h-5 text-xs">
                  {pendingCount}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confirmées:</span>
                <Badge variant="outline" className="h-5 text-xs">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full mt-4 text-sm bg-white hover:bg-gray-50"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}