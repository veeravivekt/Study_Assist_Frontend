"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import type { Page } from "@/lib/types";
import { pagesAtom } from "@/lib/atoms";
import { PageItem } from "./page-item";

interface PageTreeProps {
  parentId?: string;
  level?: number;
}

export function PageTree({ parentId, level = 0 }: PageTreeProps) {
  const pages = useAtomValue(pagesAtom);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  // Filter pages by parent
  const childPages = pages.filter((page) => {
    if (parentId === undefined) {
      return !page.parentId;
    }
    return page.parentId === parentId;
  });

  const toggleExpand = (pageId: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  };

  if (childPages.length === 0) {
    return null;
  }

  return (
    <div>
      {childPages.map((page) => {
        const children = pages.filter((p) => p.parentId === page.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedPages.has(page.id);

        return (
          <div key={page.id}>
            <PageItem
              page={page}
              level={level}
              hasChildren={hasChildren}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleExpand(page.id)}
            />
            {hasChildren && isExpanded && (
              <PageTree parentId={page.id} level={level + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}

