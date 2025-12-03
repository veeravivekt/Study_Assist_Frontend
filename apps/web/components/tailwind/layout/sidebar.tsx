"use client";

import { Search, Plus, Menu, Settings, LogOut } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/tailwind/ui/input";
import { Button } from "@/components/tailwind/ui/button";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Separator } from "@/components/tailwind/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/tailwind/ui/avatar";
import { PageTree } from "./page-tree";
import {
  pagesAtom,
  sidebarOpenAtom,
  setSidebarOpenAtom,
} from "@/lib/atoms";
import type { Page } from "@/lib/types";
import { storage } from "@/lib/storage";

interface SidebarProps {
  onCreatePage?: () => void;
  onSettingsClick?: () => void;
  onPropertiesClick?: () => void;
}

export function Sidebar({ onCreatePage, onSettingsClick, onPropertiesClick }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const pages = useAtomValue(pagesAtom);
  const sidebarOpen = useAtomValue(sidebarOpenAtom);
  const setSidebarOpen = useSetAtom(setSidebarOpenAtom);

  // Prevent hydration mismatch by only rendering dynamic content after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    const query = searchQuery.toLowerCase();
    return pages.filter(
      (page) =>
        page.title.toLowerCase().includes(query) ||
        page.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [pages, searchQuery]);

  if (!sidebarOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-2 top-2 z-50"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="flex flex-col h-full w-64 border-r bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Pages</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* New Page Button */}
      <div className="p-2 border-b">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onCreatePage}
        >
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Page Tree */}
          {searchQuery ? (
            <div className="space-y-1">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="px-2 py-1 text-sm rounded-md hover:bg-accent cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    storage.setCurrentPageId(page.id);
                    window.location.reload();
                  }}
                >
                  {page.icon && <span>{page.icon}</span>}
                  <span className="truncate">{page.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <PageTree onPropertiesClick={onPropertiesClick} />
          )}
        </div>
      </ScrollArea>

      {/* Footer with Settings */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => onSettingsClick?.()}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Footer with User Info and Sign Out */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User Name</p>
            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
          </div>
        </div>
        <div className="p-2 pt-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={() => {
              // Handle sign out
              console.log("Sign out");
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

