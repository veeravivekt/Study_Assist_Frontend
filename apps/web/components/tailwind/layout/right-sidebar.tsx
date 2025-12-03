"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageSquare, FileText, List } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Separator } from "@/components/tailwind/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tailwind/ui/tabs";
import { TableOfContents } from "./table-of-contents";
import { ChatInterface } from "./chat-interface";
import { DocumentsList } from "./documents-list";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_WIDTH = 300;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 350;

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(DEFAULT_WIDTH);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const diff = startXRef.current - e.clientX; // Inverted because we're resizing from left
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + diff));
    setWidth(newWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div className="relative flex-shrink-0" style={{ width: `${width}px` }}>
      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 transition-colors z-10"
        onMouseDown={handleMouseDown}
      />
      
      <div
        ref={sidebarRef}
        className="flex flex-col h-full border-l bg-background"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Assistant</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="toc" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="toc" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Contents
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="toc" className="flex-1 flex flex-col min-h-0 mt-2 data-[state=inactive]:hidden">
            <ScrollArea className="flex-1 px-4">
              <TableOfContents />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 mt-2 data-[state=inactive]:hidden">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="documents" className="flex-1 flex flex-col min-h-0 mt-2 data-[state=inactive]:hidden">
            <ScrollArea className="flex-1 px-4">
              <DocumentsList />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

