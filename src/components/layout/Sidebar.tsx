
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import {
  Home,
  BarChart2,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => {
  return (
    <li>
      <Button
        variant="ghost"
        size="lg"
        onClick={onClick}
        className={cn(
          "w-full justify-start gap-3 text-base font-normal",
          active
            ? "bg-neon-lime/10 text-neon-lime border-l-2 border-neon-lime"
            : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Button>
    </li>
  );
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) setIsMobileOpen(false);
  };

  const sidebar = (
    <div
      className={cn(
        "h-screen flex flex-col bg-dark-secondary border-r border-gray-800 transition-all duration-300",
        collapsed && !isMobile ? "w-20" : "w-64",
        isMobile ? "fixed z-50 left-0 top-0 bottom-0" : ""
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <div className="flex items-center">
          <span className={cn("text-xl font-bold text-white", collapsed && !isMobile ? "hidden" : "")}>
            <span className="text-neon-lime">Hab</span>AI
          </span>
          {collapsed && !isMobile && <span className="text-xl font-bold text-neon-lime">H</span>}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>

      {/* User Profile */}
      <div className={cn(
        "flex items-center p-4 border-b border-gray-800",
        collapsed && !isMobile ? "justify-center" : "gap-3"
      )}>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-700">
          <img src={user?.avatar} alt="User" className="w-full h-full object-cover" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="truncate">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <NavItem 
            icon={LayoutDashboard} 
            label="Overview" 
            active={activeTab === "overview"} 
            onClick={() => handleTabChange("overview")}
          />
          <NavItem 
            icon={MessageSquare} 
            label="HabAI Coach" 
            active={activeTab === "habai"} 
            onClick={() => handleTabChange("habai")}
          />
          <NavItem 
            icon={BarChart2} 
            label="Reports" 
            active={activeTab === "reports"} 
            onClick={() => handleTabChange("reports")}
          />
          <NavItem 
            icon={Calendar} 
            label="Planner" 
            active={activeTab === "planner"} 
            onClick={() => handleTabChange("planner")}
          />
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <ul className="space-y-1">
          <NavItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === "settings"} 
            onClick={() => handleTabChange("settings")}
          />
          <NavItem 
            icon={LogOut} 
            label="Logout" 
            onClick={logout}
          />
        </ul>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="h-16 flex items-center px-4 border-b border-gray-800 bg-dark-secondary">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="text-gray-400 hover:text-white mr-4"
          >
            <Menu size={20} />
          </Button>
          <span className="text-xl font-bold text-white">
            <span className="text-neon-lime">Hab</span>AI
          </span>
        </div>
        {isMobileOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40" 
              onClick={() => setIsMobileOpen(false)}
            />
            {sidebar}
          </>
        )}
      </>
    );
  }

  return sidebar;
};

export default Sidebar;
