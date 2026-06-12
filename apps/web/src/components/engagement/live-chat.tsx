"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { cn, getApiUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface LiveChatProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LiveChat({ open: controlledOpen, onOpenChange }: LiveChatProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Glitz's AI assistant. How can I help you plan your perfect event today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(getApiUrl("/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });

      const data = await res.json().catch(() => ({}));
      if (typeof data.sessionId === "string" && data.sessionId.trim()) {
        setSessionId(data.sessionId.trim());
      }
      const reply =
        data.reply ||
        data.message ||
        "Thank you for your message! Our team will get back to you shortly. For immediate assistance, please call us or use WhatsApp.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again or contact us directly via phone or WhatsApp.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isControlled && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full shadow-glow md:bottom-8 md:left-8"
          size="icon"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[min(500px,70vh)] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl glass-card shadow-glow"
          >
            <div className="flex items-center justify-between border-b border-border bg-primary/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-gold">
                  <Bot className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Glitz Assistant</p>
                  <p className="text-xs text-muted">Typically replies instantly</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      msg.role === "user"
                        ? "bg-secondary text-foreground"
                        : "gradient-gold text-black"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-tl-sm glass"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-gold">
                    <Bot className="h-3.5 w-3.5 text-black" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={sendMessage}
              className="flex gap-2 border-t border-border p-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about events, pricing..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
