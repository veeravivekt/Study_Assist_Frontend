"use client";

import { MoreHorizontal, Image, Check, X } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { useState, useEffect, useRef } from "react";
import type { Page } from "@/lib/types";
import {
  currentPageIdAtom,
  deletePageAtom,
  updatePageAtom,
} from "@/lib/atoms";
import { storage } from "@/lib/storage";
import { Button } from "@/components/tailwind/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";
import { Input } from "@/components/tailwind/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { cn } from "@/lib/utils";

interface PageItemProps {
  page: Page;
  onPropertiesClick?: () => void;
}

export function PageItem({
  page,
  onPropertiesClick,
}: PageItemProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [titleValue, setTitleValue] = useState(page.title);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentPageId = useAtomValue(currentPageIdAtom);
  const setCurrentPageIdAtom = useSetAtom(currentPageIdAtom);
  const deletePage = useSetAtom(deletePageAtom);
  const updatePage = useSetAtom(updatePageAtom);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTitleValue(page.title);
  }, [page.title]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  // Only compute isActive after mount to prevent hydration mismatch
  const isActive = isMounted && currentPageId === page.id;

  const handleClick = () => {
    if (!isEditingTitle && !iconPickerOpen) {
      storage.setCurrentPageId(page.id);
      setCurrentPageIdAtom(page.id);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      deletePage(page.id);
    }
  };

  const handleRename = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue.trim() !== page.title) {
      updatePage(page.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleValue(page.title);
    setIsEditingTitle(false);
  };

  const handleIconChange = (emojiData: EmojiClickData) => {
    updatePage(page.id, { icon: emojiData.emoji });
    setIconPickerOpen(false);
  };

  const handleRemoveIcon = () => {
    updatePage(page.id, { icon: undefined });
    setIconPickerOpen(false);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1 px-2 py-1 rounded-md text-sm",
        "hover:bg-accent transition-colors",
        isMounted && isActive && "bg-accent font-medium",
        !isEditingTitle && !iconPickerOpen && "cursor-pointer"
      )}
    >
      {isEditingTitle ? (
        <div className="flex-1 flex items-center gap-1">
          <Input
            ref={inputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleSave();
              } else if (e.key === "Escape") {
                handleTitleCancel();
              }
            }}
            onBlur={handleTitleSave}
            className="h-7 text-sm"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleTitleSave();
            }}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleTitleCancel();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIconPickerOpen(true);
                }}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-accent transition-colors"
                title="Change icon"
              >
                {page.icon ? (
                  <span className="text-base">{page.icon}</span>
                ) : (
                  <Image className="h-3 w-3 text-muted-foreground opacity-50" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
              <EmojiPicker
                onEmojiClick={handleIconChange}
                width={350}
                height={400}
                searchDisabled={false}
              />
              {page.icon && (
                <div className="p-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={handleRemoveIcon}
                  >
                    Remove icon
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <button
            onClick={handleClick}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleRename();
            }}
            className="flex-1 text-left min-w-0 truncate"
          >
            <span className="truncate">{page.title}</span>
          </button>
        </div>
      )}

      {isMounted && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPropertiesClick && (
                <>
                  <DropdownMenuItem onClick={onPropertiesClick}>
                    Properties
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
