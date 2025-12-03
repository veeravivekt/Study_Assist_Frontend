"use client";

import { useAtomValue } from "jotai";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { pagesAtom } from "@/lib/atoms";
import { Input } from "@/components/tailwind/ui/input";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import type { Page } from "@/lib/types";
import { storage } from "@/lib/storage";

export function PageSearch() {
  const pages = useAtomValue(pagesAtom);
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(pages, {
        keys: ["title", "tags"],
        threshold: 0.3,
      }),
    [pages]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map((result) => result.item);
  }, [query, fuse]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search pages..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ScrollArea className="h-[400px]">
        <div className="space-y-1">
          {results.map((page: Page) => (
            <div
              key={page.id}
              className="p-2 rounded-md hover:bg-accent cursor-pointer"
              onClick={() => {
                storage.setCurrentPageId(page.id);
                window.location.reload();
              }}
            >
              {page.icon && <span className="mr-2">{page.icon}</span>}
              {page.title}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

