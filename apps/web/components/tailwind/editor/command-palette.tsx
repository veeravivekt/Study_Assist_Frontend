"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import {
  Dialog,
  DialogContent,
} from "@/components/tailwind/ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/tailwind/ui/command";
import { pagesAtom } from "@/lib/atoms";
import { storage } from "@/lib/storage";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const pages = useAtomValue(pagesAtom);
  const [search, setSearch] = useState("");

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <Command>
          <CommandInput placeholder="Search pages..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            {filteredPages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => {
                  storage.setCurrentPageId(page.id);
                  onOpenChange(false);
                  window.location.reload();
                }}
              >
                {page.icon && <span className="mr-2">{page.icon}</span>}
                {page.title}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

