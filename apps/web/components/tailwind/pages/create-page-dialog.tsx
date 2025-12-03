"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Button } from "@/components/tailwind/ui/button";
import { createPageAtom } from "@/lib/atoms";
import { getPageTemplates } from "@/lib/mock-data";
import type { PageTemplate } from "@/lib/types";
import { IconPicker } from "./icon-picker";

interface CreatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePageDialog({ open, onOpenChange }: CreatePageDialogProps) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const createPage = useSetAtom(createPageAtom);
  const templates = getPageTemplates();

  const handleCreate = () => {
    if (title.trim()) {
      createPage({
        id: crypto.randomUUID(),
        title: title.trim(),
        icon: icon || undefined,
        content: selectedTemplate?.content || { type: "doc", content: [] },
      });
      setTitle("");
      setIcon("");
      setSelectedTemplate(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
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
                  handleCreate();
                }
              }}
            />
          </div>
          <IconPicker value={icon} onChange={setIcon} />
          <div>
            <p className="text-sm font-medium mb-2">Templates</p>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                  onClick={() => setSelectedTemplate(template)}
                  className="justify-start"
                >
                  <span className="mr-2">{template.icon}</span>
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

