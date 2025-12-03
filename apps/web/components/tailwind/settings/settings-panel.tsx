"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/tailwind/ui/sheet";
import { Label } from "@/components/tailwind/ui/label";
import { Switch } from "@/components/tailwind/ui/switch";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only showing theme-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Editor Preferences</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-save</span>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Appearance</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark mode</span>
              <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

