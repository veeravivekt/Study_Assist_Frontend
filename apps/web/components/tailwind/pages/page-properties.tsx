"use client";

import { useAtomValue } from "jotai";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/tailwind/ui/sheet";
import { currentPageAtom } from "@/lib/atoms";
import { Input } from "@/components/tailwind/ui/input";
import { Label } from "@/components/tailwind/ui/label";

interface PagePropertiesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageProperties({ open, onOpenChange }: PagePropertiesProps) {
  const currentPage = useAtomValue(currentPageAtom);

  if (!currentPage) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Page Properties</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title</Label>
            <Input value={currentPage.title} readOnly />
          </div>
          <div>
            <Label>Created</Label>
            <Input value={currentPage.createdAt.toLocaleDateString()} readOnly />
          </div>
          <div>
            <Label>Last Modified</Label>
            <Input value={currentPage.updatedAt.toLocaleDateString()} readOnly />
          </div>
          {currentPage.tags && currentPage.tags.length > 0 && (
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentPage.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-accent rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

