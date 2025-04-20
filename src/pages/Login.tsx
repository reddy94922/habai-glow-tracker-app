
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/", { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login submission error:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setEmail("demo@example.com");
    setPassword("password");
    
    try {
      const success = await login("demo@example.com", "password");
      if (success) {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Demo login error:", error);
      toast.error("Demo login failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark">
      <div className="w-full max-w-md px-8 py-10 glassmorphism rounded-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="text-neon-lime text-shadow-sm">Hab</span>AI
          </h1>
          <p className="text-gray-400">Sign in to continue to your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-300">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-dark-secondary border-gray-700 focus:border-neon-lime focus:ring-neon-lime"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-dark-secondary border-gray-700 focus:border-neon-lime focus:ring-neon-lime pr-10"
                disabled={isLoading}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-neon-lime hover:bg-neon-lime/80 text-black font-medium transition duration-300 shadow-neon-lime"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <LogIn size={18} className="mr-2" />
                Sign In
              </span>
            )}
          </Button>
        </form>
        
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full border-gray-700 hover:bg-gray-700/50 text-gray-300 hover:text-white transition duration-300"
          >
            Try Demo Account
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-neon-lime hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
