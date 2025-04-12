
import { useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const DashboardLayout = ({ 
  children, 
  title = "Dashboard", 
  description = "View and manage your data"
}: DashboardLayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />
      
      <div className="flex-1 overflow-y-auto">
        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                {title}
              </h1>
              <p className="text-gray-400">
                {description}
              </p>
            </header>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
