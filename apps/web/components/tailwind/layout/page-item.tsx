"use client";

import { MoreHorizontal, Star } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import type { Page } from "@/lib/types";
import {
  currentPageIdAtom,
  deletePageAtom,
  favoritesAtom,
  toggleFavoriteAtom,
  updatePageAtom,
} from "@/lib/atoms";
import { storage } from "@/lib/storage";
import { Button } from "@/components/tailwind/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PageItemProps {
  page: Page;
}

export function PageItem({
  page,
}: PageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const currentPageId = useAtomValue(currentPageIdAtom);
  const favorites = useAtomValue(favoritesAtom);
  const setCurrentPageIdAtom = useSetAtom(currentPageIdAtom);
  const toggleFavorite = useSetAtom(toggleFavoriteAtom);
  const updatePage = useSetAtom(updatePageAtom);
  const deletePage = useSetAtom(deletePageAtom);

  const isActive = currentPageId === page.id;
  const isFavorite = favorites.includes(page.id);

  const handleClick = () => {
    storage.setCurrentPageId(page.id);
    setCurrentPageIdAtom(page.id);
  };

  const handleFavorite = () => {
    toggleFavorite(page.id);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      deletePage(page.id);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1 px-2 py-1 rounded-md text-sm cursor-pointer",
        "hover:bg-accent transition-colors",
        isActive && "bg-accent font-medium"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <button
        onClick={handleClick}
        className="flex-1 flex items-center gap-2 text-left min-w-0"
      >
        {page.icon && <span className="text-base flex-shrink-0">{page.icon}</span>}
        <span className="truncate">{page.title}</span>
      </button>

      {isHovered && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          >
            <Star
              className={cn(
                "h-3 w-3",
                isFavorite && "fill-yellow-500 text-yellow-500"
              )}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleFavorite}>
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
