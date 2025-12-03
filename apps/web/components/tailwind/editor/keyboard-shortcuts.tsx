"use client";

import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { currentPageIdAtom, createPageAtom } from "@/lib/atoms";
import { storage } from "@/lib/storage";

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  const shortcuts = [
    { key: "Cmd/Ctrl + K", description: "Open command palette" },
    { key: "Cmd/Ctrl + /", description: "Show keyboard shortcuts" },
    { key: "Cmd/Ctrl + N", description: "New page" },
    { key: "Cmd/Ctrl + P", description: "Search pages" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex justify-between">
              <span className="font-mono text-sm">{shortcut.key}</span>
              <span className="text-muted-foreground">{shortcut.description}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useKeyboardShortcuts() {
  const createPage = useSetAtom(createPageAtom);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "k") {
        e.preventDefault();
        // Open command palette - will be implemented
      }

      if (modKey && e.key === "/") {
        e.preventDefault();
        setShortcutsOpen(true);
      }

      if (modKey && e.key === "n") {
        e.preventDefault();
        // Create new page
      }

      if (modKey && e.key === "p") {
        e.preventDefault();
        // Search pages
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [createPage]);

  return { shortcutsOpen, setShortcutsOpen };
}

