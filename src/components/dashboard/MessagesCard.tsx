
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Message } from "@/types/database.types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { mockMessages } from "@/lib/mock-data";

interface MessagesCardProps {
  className?: string;
  onClick?: () => void;
}

const MessagesCard = ({ className, onClick }: MessagesCardProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMessages();
    } else {
      // Use mock messages when not authenticated or for demo purposes
      setMessages(mockMessages);
    }
  }, [isAuthenticated, user]);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setMessages(data as Message[]);
      } else {
        // Fall back to mock messages if no real messages exist yet
        setMessages(mockMessages);
      }
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setError(err.message);
      // Fall back to mock messages on error
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };
  
  const formatMessageTime = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
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
  
  const handleOpenMessage = async (e: React.MouseEvent, messageId?: string) => {
    e.stopPropagation();
    
    // If we have a real message ID, mark it as read
    if (messageId && isAuthenticated) {
      try {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', messageId);
      } catch (err) {
        console.error("Error marking message as read:", err);
      }
    }
    
    toast.success("Opening chat with HabAI...");
    navigate('/habai');
  };
  
  return (
    <Card
      onClick={onClick || (() => handleOpenMessage({} as React.MouseEvent))}
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
        {messages.some(msg => !msg.read) && (
          <div className="w-2 h-2 rounded-full bg-neon-lime"></div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700/50 rounded"></div>
                <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-400 text-sm">
          <p>Couldn't load messages</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              fetchMessages();
            }}
            className="text-neon-blue hover:underline mt-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id}
              onClick={(e) => handleOpenMessage(e, message.id)}
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
                  <span className="text-xs text-gray-400">{formatMessageTime(message.created_at)}</span>
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
      )}
    </Card>
  );
};

export default MessagesCard;
