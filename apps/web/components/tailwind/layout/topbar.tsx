"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import { Input } from "@/components/tailwind/ui/input";
import { currentPageAtom } from "@/lib/atoms";

interface TopbarProps {
  onPropertiesClick?: () => void;
}

export function Topbar({ onPropertiesClick }: TopbarProps) {
  const currentPage = useAtomValue(currentPageAtom);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentPage?.title || "");

  const handleTitleSubmit = () => {
    if (currentPage && titleValue.trim()) {
      // Update page title - will be handled by updatePageAtom
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b bg-background">
      {/* Page Title */}
      <div className="flex items-center flex-1 min-w-0">
        {currentPage && (
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTitleSubmit();
                  } else if (e.key === "Escape") {
                    setTitleValue(currentPage.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="h-8 font-semibold"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-lg font-semibold hover:bg-accent px-2 py-1 rounded -ml-2 truncate max-w-full flex items-center gap-2"
              >
                {currentPage.icon && <span>{currentPage.icon}</span>}
                <span>{currentPage.title}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

