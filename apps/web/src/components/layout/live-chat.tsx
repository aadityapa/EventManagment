"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="touch-target fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full gradient-gold shadow-glow transition-transform hover:scale-105 sm:bottom-6 sm:left-6 sm:h-14 sm:w-14 md:bottom-6"
        aria-label={open ? "Close live chat" : "Open live chat"}
      >
        {open ? <X className="h-5 w-5 text-black sm:h-6 sm:w-6" /> : <MessageCircle className="h-5 w-5 text-black sm:h-6 sm:w-6" />}
      </button>

      {open && (
        <div className="fixed inset-x-3 bottom-[5.5rem] z-40 flex max-h-[min(70dvh,32rem)] flex-col overflow-hidden rounded-xl glass-card shadow-glow sm:inset-x-auto sm:bottom-24 sm:left-6 sm:w-full sm:max-w-sm md:bottom-24">
          <div className="gradient-dark shrink-0 p-4 text-white">
            <h4 className="font-semibold">Glitz Live Chat</h4>
            <p className="text-xs text-white/70">Typically replies within minutes</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="glass-card mb-3 max-w-[85%] p-3 text-sm">
              Hello! How can we help you plan your extraordinary event today?
            </div>
          </div>
          <form
            className="flex shrink-0 gap-2 border-t border-border p-3 safe-bottom"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("");
            }}
          >
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-0 flex-1"
            />
            <Button type="submit" size="icon" variant="default" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
