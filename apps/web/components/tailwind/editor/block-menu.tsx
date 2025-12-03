"use client";

import { GripVertical, Trash2, Copy } from "lucide-react";
import { useEditor } from "novel";
import { Button } from "@/components/tailwind/ui/button";

export function BlockMenu() {
  const { editor } = useEditor();
  
  if (!editor) return null;

  // This is a simplified block menu
  // Full implementation would use floating-ui for positioning
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" className="h-6 w-6">
        <GripVertical className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => {
          const { from, to } = editor.state.selection;
          const content = editor.state.doc.slice(from, to).toJSON();
          navigator.clipboard.writeText(JSON.stringify(content));
        }}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-destructive"
        onClick={() => {
          editor.chain().focus().deleteSelection().run();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

