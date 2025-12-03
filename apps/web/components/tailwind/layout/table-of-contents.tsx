"use client";

import { useEffect, useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import { currentPageAtom } from "@/lib/atoms";
import type { JSONContent } from "novel";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  level: number;
  text: string;
  position: number;
}

export function TableOfContents() {
  const currentPage = useAtomValue(currentPageAtom);
  const [headings, setHeadings] = useState<Heading[]>([]);

  // Extract headings from JSONContent
  const extractHeadings = useMemo(() => {
    return (content: JSONContent | null): Heading[] => {
      if (!content || !content.content) return [];

      const headingsList: Heading[] = [];
      let position = 0;

      const traverse = (node: JSONContent, level: number = 0) => {
        if (node.type === "heading" && node.attrs?.level) {
          const headingLevel = node.attrs.level as number;
          const text = extractTextFromNode(node);
          if (text) {
            const id = `heading-${position}-${text.toLowerCase().replace(/\s+/g, "-")}`;
            headingsList.push({
              id,
              level: headingLevel,
              text,
              position,
            });
            position++;
          }
        }

        if (node.content) {
          node.content.forEach((child) => traverse(child, level + 1));
        }
      };

      traverse(content);
      return headingsList;
    };
  }, []);

  const extractTextFromNode = (node: JSONContent): string => {
    if (node.text) return node.text;
    if (node.content) {
      return node.content
        .map((child) => extractTextFromNode(child))
        .join("");
    }
    return "";
  };

  useEffect(() => {
    if (currentPage?.content) {
      const extractedHeadings = extractHeadings(currentPage.content);
      setHeadings(extractedHeadings);
    } else {
      setHeadings([]);
    }
  }, [currentPage?.content, extractHeadings]);

  if (headings.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        <p>No headings found in this document.</p>
        <p className="mt-2 text-xs">Add headings to see them here.</p>
      </div>
    );
  }

  const handleHeadingClick = (heading: Heading) => {
    // Scroll to heading in the editor
    const element = document.querySelector(`[data-heading-id="${heading.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="py-4 space-y-1">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Table of Contents</h3>
      {headings.map((heading, index) => (
        <button
          key={`${heading.id}-${index}`}
          onClick={() => handleHeadingClick(heading)}
          className={cn(
            "block w-full text-left px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-sm",
            heading.level === 1 && "font-semibold",
            heading.level === 2 && "pl-4",
            heading.level === 3 && "pl-6",
            heading.level === 4 && "pl-8",
            heading.level === 5 && "pl-10",
            heading.level === 6 && "pl-12"
          )}
        >
          {heading.text}
        </button>
      ))}
    </div>
  );
}

