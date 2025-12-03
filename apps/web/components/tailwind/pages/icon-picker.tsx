"use client";

import { useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { Button } from "@/components/tailwind/ui/button";
import { Smile } from "lucide-react";

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label = "Icon" }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-10"
          >
            {value ? (
              <span className="text-xl mr-2">{value}</span>
            ) : (
              <Smile className="h-4 w-4 mr-2" />
            )}
            {value ? "Change icon" : "Select icon"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={350}
            height={400}
            searchDisabled={false}
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => onChange("")}
        >
          Remove icon
        </Button>
      )}
    </div>
  );
}

