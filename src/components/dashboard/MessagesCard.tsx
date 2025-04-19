
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockMessages } from "@/lib/mock-data";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MessagesCardProps {
  className?: string;
  onClick?: () => void;
}

const MessagesCard = ({ className, onClick }: MessagesCardProps) => {
  const navigate = useNavigate();
  
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (60 * 60 * 1000));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };
  
  const handleOpenMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Opening chat with HabAI...");
    navigate('/habai');
  };
  
  return (
    <Card
      onClick={onClick || handleOpenMessage}
      className={cn(
        "glassmorphism p-5 card-hover cursor-pointer",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="mr-2 text-neon-blue">
            <MessageSquare size={18} />
          </div>
          <h3 className="text-white font-medium">Messages</h3>
        </div>
        {mockMessages.some(msg => !msg.read) && (
          <div className="w-2 h-2 rounded-full bg-neon-lime"></div>
        )}
      </div>
      
      <div className="space-y-3">
        {mockMessages.map((message) => (
          <div 
            key={message.id}
            onClick={handleOpenMessage}
            className={cn(
              "p-3 rounded-lg transition-colors cursor-pointer flex items-start",
              message.read ? "bg-transparent hover:bg-gray-800/50" : "bg-gray-800/70 hover:bg-gray-800"
            )}
          >
            <div className="flex-shrink-0 w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xs font-medium text-neon-blue">AI</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-white">HabAI</p>
                <span className="text-xs text-gray-400">{formatMessageTime(message.createdAt)}</span>
              </div>
              
              <p className="text-xs text-gray-300 line-clamp-2 mt-0.5">
                {message.text}
              </p>
            </div>
            
            {!message.read && (
              <div className="w-2 h-2 rounded-full bg-neon-lime flex-shrink-0 mt-2 ml-2"></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MessagesCard;
