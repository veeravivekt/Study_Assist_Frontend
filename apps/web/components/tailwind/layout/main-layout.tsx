"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { RightSidebar } from "./right-sidebar";
import TailwindAdvancedEditor from "../advanced-editor";
import { CreatePageDialog } from "../pages/create-page-dialog";
import { PageProperties } from "../pages/page-properties";
import { CommandPalette } from "../editor/command-palette";
import { SettingsPanel } from "../settings/settings-panel";

export function MainLayout() {
  const [createPageOpen, setCreatePageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          onCreatePage={() => setCreatePageOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Topbar
            onPropertiesClick={() => setPropertiesOpen(true)}
          />
          <div className="flex-1 overflow-auto">
            <TailwindAdvancedEditor />
          </div>
        </div>
        <RightSidebar isOpen={rightSidebarOpen} onClose={() => setRightSidebarOpen(false)} />
      </div>
      {!rightSidebarOpen && (
        <button
          onClick={() => setRightSidebarOpen(true)}
          className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
          title="Open Assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}
      <CreatePageDialog open={createPageOpen} onOpenChange={setCreatePageOpen} />
      <PageProperties open={propertiesOpen} onOpenChange={setPropertiesOpen} />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

