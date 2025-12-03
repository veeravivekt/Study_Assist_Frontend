"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { pagesAtom, currentPageAtom } from "@/lib/atoms";
import { FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentsListProps {
  compact?: boolean;
}

export function DocumentsList({ compact = false }: DocumentsListProps) {
  const pages = useAtomValue(pagesAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([currentPage?.id || ""]);

  // Toggle document selection
  const toggleDocument = (pageId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId]
    );
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {pages.slice(0, 3).map((page) => (
          <div
            key={page.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors",
              selectedDocs.includes(page.id)
                ? "bg-primary/10 border-primary"
                : "bg-background hover:bg-accent"
            )}
            onClick={() => toggleDocument(page.id)}
          >
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm truncate">{page.title}</span>
            </div>
            {selectedDocs.includes(page.id) && (
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </div>
        ))}
        {pages.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            +{pages.length - 3} more documents
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="py-4 space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Documents</h3>
      {pages.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <p>No documents available.</p>
        </div>
      ) : (
        pages.map((page) => (
          <div
            key={page.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors",
              selectedDocs.includes(page.id)
                ? "bg-primary/10 border-primary"
                : "bg-background hover:bg-accent",
              currentPage?.id === page.id && "ring-2 ring-primary/20"
            )}
            onClick={() => toggleDocument(page.id)}
          >
            <div className="flex-1 flex items-center gap-2 min-w-0">
              {page.icon && <span className="text-lg">{page.icon}</span>}
              <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm truncate">{page.title}</span>
            </div>
            {selectedDocs.includes(page.id) && (
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </div>
        ))
      )}
    </div>
  );
}

