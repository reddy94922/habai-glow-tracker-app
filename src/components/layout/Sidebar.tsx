
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Link, useLocation } from "react-router-dom";
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
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, to, active, onClick }: NavItemProps) => {
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
        asChild
      >
        <Link to={to}>
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      </Button>
    </li>
  );
};

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const handleTabChange = () => {
    if (isMobile) setIsMobileOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
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
            to="/"
            active={isActive("/")} 
            onClick={handleTabChange}
          />
          <NavItem 
            icon={MessageSquare} 
            label="HabAI Coach" 
            to="/habai"
            active={isActive("/habai")} 
            onClick={handleTabChange}
          />
          <NavItem 
            icon={BarChart2} 
            label="Reports" 
            to="/reports"
            active={isActive("/reports")} 
            onClick={handleTabChange}
          />
          <NavItem 
            icon={Calendar} 
            label="Planner" 
            to="/planner"
            active={isActive("/planner")} 
            onClick={handleTabChange}
          />
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <ul className="space-y-1">
          <NavItem 
            icon={Settings} 
            label="Settings" 
            to="/settings"
            active={isActive("/settings")} 
            onClick={handleTabChange}
          />
          <li>
            <Button
              variant="ghost"
              size="lg"
              onClick={logout}
              className="w-full justify-start gap-3 text-base font-normal text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </li>
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
