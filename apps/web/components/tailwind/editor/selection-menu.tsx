"use client";

import { Bold, Italic, Link, Highlighter } from "lucide-react";
import { useEditor } from "novel";
import { Button } from "@/components/tailwind/ui/button";

export function SelectionMenu() {
  const { editor } = useEditor();
  
  if (!editor) return null;

  // Simplified selection menu - TipTap's BubbleMenu would be used for full implementation
  return (
    <div className="flex items-center gap-1 bg-background border rounded-lg p-1 shadow-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-accent" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-accent" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive("highlight") ? "bg-accent" : ""}
      >
        <Highlighter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive("link") ? "bg-accent" : ""}
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}

