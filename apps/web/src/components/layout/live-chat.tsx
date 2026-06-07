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
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-gold shadow-glow transition-transform hover:scale-105 md:bottom-6"
        aria-label="Open live chat"
      >
        {open ? <X className="h-6 w-6 text-black" /> : <MessageCircle className="h-6 w-6 text-black" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-40 w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-xl glass-card shadow-glow">
          <div className="gradient-dark p-4 text-white">
            <h4 className="font-semibold">JIJU Live Chat</h4>
            <p className="text-xs text-white/70">Typically replies within minutes</p>
          </div>
          <div className="h-48 overflow-y-auto p-4">
            <div className="glass-card mb-3 max-w-[85%] p-3 text-sm">
              Hello! How can we help you plan your extraordinary event today?
            </div>
          </div>
          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("");
            }}
          >
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="default">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
