
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="glassmorphism rounded-2xl p-8 max-w-md text-center">
        <div className="inline-block rounded-full p-6 bg-dark-secondary mb-6">
          <span className="text-6xl">🤔</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-6">Oops! This page doesn't exist.</p>
        <p className="text-gray-400 mb-8">
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild className="bg-neon-lime hover:bg-neon-lime/80 text-black font-medium">
          <Link to="/" className="flex items-center">
            <Home size={18} className="mr-2" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
