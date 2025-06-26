
import React, { useState, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ 
  onSubmit, 
  isLoading = false,
  placeholder = "Describe your Discord bot..."
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <Textarea 
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="resize-none min-h-[50px] bg-secondary border-secondary"
        disabled={isLoading}
      />
      <Button 
        size="icon" 
        className="h-10 w-10 shrink-0 bg-discord-blurple hover:bg-discord-blurple/80"
        onClick={handleSubmit}
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
