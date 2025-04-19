
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Copy, ArrowUp, ThumbsUp, ThumbsDown, Bot } from "lucide-react";
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
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem("gemini_api_key"));
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveApiKey = (key: string) => {
    localStorage.setItem("gemini_api_key", key);
    setApiKey(key);
    setShowApiKeyInput(false);
    toast.success("Gemini API key saved successfully!");
  };

  const handleSend = async (e: React.FormEvent) => {
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

    try {
      // Check if API key exists
      if (!apiKey) {
        setIsTyping(false);
        setShowApiKeyInput(true);
        toast.error("Please add your Gemini API key to continue");
        return;
      }

      // Get user's previous habits data and metrics to provide context
      const userContext = `
        The user has been tracking the following habits:
        - Morning Meditation (75% completion rate)
        - Daily Exercise (60% completion rate)
        - Water Intake (85% completion rate)
        - Reading (40% completion rate)
        
        Their current streak is 7 days.
        Their overall consistency is 65%.
      `;

      // Prepare the conversation history for context
      const recentMessages = messages.slice(-6).map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      // Send to Gemini API
      const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `You are HabAI Coach, an AI habit coach. Your goal is to help users build and maintain healthy habits.
              You're encouraging, understanding, but also hold users accountable.
              Keep responses conversational and focused on habit-building.
              Use the following context about the user's habits: ${userContext}` }]
            },
            ...recentMessages,
            {
              role: "user",
              parts: [{ text: input }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error connecting to Gemini API");
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Sorry, I encountered an error while processing your request. ${error instanceof Error ? error.message : "Please try again later."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
        {/* API Key Input Modal */}
        {showApiKeyInput && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 p-4">
            <div className="bg-dark-secondary rounded-lg p-6 w-full max-w-md border border-neon-lime/30 shadow-[0_0_15px_rgba(204,255,153,0.15)]">
              <div className="flex items-center mb-4 gap-2">
                <Bot className="w-6 h-6 text-neon-lime" />
                <h3 className="text-xl font-medium text-white">Connect to Gemini</h3>
              </div>
              <p className="text-gray-400 mb-4">
                To use HabAI Coach, please provide your Gemini API key. You can get one at <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-neon-lime hover:underline">https://ai.google.dev/</a>. This will be stored locally on your device.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const key = formData.get("apiKey") as string;
                if (key) saveApiKey(key);
              }}>
                <Input 
                  name="apiKey"
                  type="password"
                  placeholder="Enter your Gemini API key" 
                  className="bg-dark-secondary border-gray-700 mb-4 text-white"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-gray-400 hover:text-white"
                    onClick={() => setShowApiKeyInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-neon-lime hover:bg-neon-lime/80 text-gray-900"
                  >
                    Save API Key
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

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
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {apiKey 
                ? "Connected to Gemini API" 
                : "API key needed for intelligent responses"}
            </p>
            {apiKey && (
              <Button 
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-neon-lime p-0 h-auto"
                onClick={() => setShowApiKeyInput(true)}
              >
                Change API Key
              </Button>
            )}
          </div>
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
