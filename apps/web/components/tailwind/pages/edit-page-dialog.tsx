"use client";

import { useState, useEffect } from "react";
import { useSetAtom } from "jotai";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Button } from "@/components/tailwind/ui/button";
import { updatePageAtom } from "@/lib/atoms";
import { IconPicker } from "./icon-picker";
import type { Page } from "@/lib/types";

interface EditPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: Page | null;
}

export function EditPageDialog({ open, onOpenChange, page }: EditPageDialogProps) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>("");
  const updatePage = useSetAtom(updatePageAtom);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setIcon(page.icon || "");
    }
  }, [page]);

  const handleSave = () => {
    if (page && title.trim()) {
      updatePage(page.id, {
        title: title.trim(),
        icon: icon || undefined,
      });
      onOpenChange(false);
    }
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Page Title</label>
            <Input
              placeholder="Page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
          <IconPicker value={icon} onChange={setIcon} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

