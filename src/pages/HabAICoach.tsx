
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Copy, ArrowUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: "👋 Hello! I'm your HabAI Coach. I'm here to help you build and maintain healthy habits. Ask me anything about habit formation, consistency, or specific advice for your routine!",
    timestamp: new Date(),
  },
];

const HabAICoach = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock responses for different questions
  const mockResponses: Record<string, string> = {
    journal: "Journaling is most effective when done consistently, either in the morning or evening. Based on your activity patterns, I'd suggest journaling in the evening around 9 PM when your energy is still good but you're starting to wind down. Try setting a 10-minute timer and keeping your journal visible on your nightstand as a reminder.",
    workout: "Looking at your activity data, your most consistent workout days are Tuesday, Thursday, and Saturday mornings. Your completion rate is highest when you exercise before noon. I'd suggest scheduling your workouts between 7-9 AM on those days for optimal consistency.",
    water: "You've been doing great with your hydration habit lately! Your completion rate has increased by 27% in the last two weeks, and you're now averaging 7 glasses per day. Keep it up, and consider using your water tracking habit as an anchor for other habits you want to build.",
    meditation: "For meditation, starting with just 5 minutes daily is ideal. Based on your schedule, I notice you have a 15-minute gap between your morning routine and work start time. This would be perfect for a quick meditation session to center yourself before the day begins.",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      let response: string = "";

      // Check for relevant keywords in the user's message
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes("journal")) {
        response = mockResponses.journal;
      } else if (lowercaseInput.includes("workout") || lowercaseInput.includes("exercise")) {
        response = mockResponses.workout;
      } else if (lowercaseInput.includes("water") || lowercaseInput.includes("hydration")) {
        response = mockResponses.water;
      } else if (lowercaseInput.includes("meditate") || lowercaseInput.includes("meditation")) {
        response = mockResponses.meditation;
      } else {
        response = "I'm here to help you with your habits! Could you tell me more about what specific habit you're working on, or what area you'd like guidance with?";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFeedback = (type: "positive" | "negative") => {
    toast.success(type === "positive" ? "Thanks for the positive feedback!" : "Thanks for your feedback. We'll work to improve.");
  };

  return (
    <DashboardLayout 
      title="HabAI Coach" 
      description="Your personal AI habit coach. Ask me anything about building and maintaining healthy habits."
    >
      <div className="flex flex-col h-[calc(100vh-13rem)] bg-dark max-w-4xl mx-auto">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex max-w-[85%] mb-4",
                message.sender === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              {message.sender === "ai" && (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-3 border-2 border-neon-lime">
                  <img 
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=habai&backgroundColor=00469B" 
                    alt="HabAI" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div 
                className={cn(
                  "p-4 rounded-2xl",
                  message.sender === "user" 
                    ? "bg-gray-700 text-white rounded-tr-none" 
                    : "bg-dark-secondary border border-neon-lime/30 text-white rounded-tl-none shadow-[0_0_15px_rgba(204,255,153,0.15)]"
                )}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.sender === "ai" && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 hover:text-neon-lime"
                        onClick={() => handleCopyMessage(message.text)}
                      >
                        <Copy size={14} />
                        <span className="sr-only">Copy</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 hover:text-neon-lime"
                        onClick={() => handleFeedback("positive")}
                      >
                        <ThumbsUp size={14} />
                        <span className="sr-only">Like</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 hover:text-neon-lime"
                        onClick={() => handleFeedback("negative")}
                      >
                        <ThumbsDown size={14} />
                        <span className="sr-only">Dislike</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {message.sender === "user" && (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ml-3 border border-gray-700">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex max-w-[85%]">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-3 border-2 border-neon-lime">
                <img 
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=habai&backgroundColor=00469B" 
                  alt="HabAI" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-dark-secondary border border-neon-lime/30 text-white rounded-tl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Form */}
        <div className="border-t border-gray-800 p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your habits or for advice..."
              className="flex-1 bg-dark-secondary border-gray-700 focus:border-neon-lime focus:ring-neon-lime/30 text-white"
            />
            <Button 
              type="submit" 
              className="bg-neon-lime hover:bg-neon-lime/80 text-gray-900"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            HabAI will simulate responses based on your habit data.
          </p>
        </div>
        
        {/* Scroll To Top Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-24 right-8 rounded-full bg-neon-lime text-gray-900 hover:bg-neon-lime/80 border-none"
          onClick={handleScrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default HabAICoach;
