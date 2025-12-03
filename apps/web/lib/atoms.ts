import { atom } from "jotai";
import type { Page, RecentPage } from "./types";
import { storage } from "./storage";
import { getInitialMockPages } from "./mock-data";

// Initialize pages from storage or use mock data
const initializePages = (): Page[] => {
  const storedPages = storage.getPages();
  if (storedPages.length > 0) {
    return storedPages;
  }
  // Initialize with mock data if no pages exist
  const mockPages = getInitialMockPages();
  storage.savePages(mockPages);
  return mockPages;
};

// Core atoms
export const pagesAtom = atom<Page[]>(initializePages());

// Current page ID atom (writable)
export const currentPageIdAtom = atom<string | null>(
  storage.getCurrentPageId() || initializePages()[0]?.id || null
);

// Sidebar open state atom
export const sidebarOpenAtom = atom<boolean>(storage.getSidebarOpen());

// Recent pages atom
export const recentPagesAtom = atom<RecentPage[]>(storage.getRecentPages());

// Favorites atom
export const favoritesAtom = atom<string[]>(storage.getFavorites());

// Derived atoms
export const currentPageAtom = atom((get) => {
  const pages = get(pagesAtom);
  const currentId = get(currentPageIdAtom);
  if (!currentId) return null;
  return pages.find((p) => p.id === currentId) || null;
});

// Root pages (pages without parent)
export const rootPagesAtom = atom((get) => {
  const pages = get(pagesAtom);
  return pages.filter((p) => !p.parentId);
});

// Pages by parent ID
export const pagesByParentAtom = atom((get) => {
  const pages = get(pagesAtom);
  const map = new Map<string, Page[]>();
  pages.forEach((page) => {
    const parentId = page.parentId || "root";
    if (!map.has(parentId)) {
      map.set(parentId, []);
    }
    map.get(parentId)!.push(page);
  });
  return map;
});

// Write-only atoms for actions
export const createPageAtom = atom(null, (get, set, page: Omit<Page, "createdAt" | "updatedAt">) => {
  const newPage = storage.createPage(page);
  set(pagesAtom, storage.getPages());
  // Update current page ID through storage
  storage.setCurrentPageId(newPage.id);
  return newPage;
});

export const updatePageAtom = atom(null, (get, set, id: string, updates: Partial<Page>) => {
  const updated = storage.updatePage(id, updates);
  if (updated) {
    set(pagesAtom, storage.getPages());
  }
  return updated;
});

export const deletePageAtom = atom(null, (get, set, id: string) => {
  const deleted = storage.deletePage(id);
  if (deleted) {
    set(pagesAtom, storage.getPages());
    const currentId = get(currentPageIdAtom);
    if (currentId === id) {
      const pages = storage.getPages();
      const newCurrentId = pages[0]?.id || null;
      storage.setCurrentPageId(newCurrentId);
    }
  }
  return deleted;
});

// Helper to set current page ID (updates storage and atom)
export const setCurrentPageId = (id: string | null) => {
  storage.setCurrentPageId(id);
  // This will be used with useSetAtom
};

export const toggleFavoriteAtom = atom(null, (get, set, pageId: string) => {
  const isFavorite = storage.toggleFavorite(pageId);
  set(favoritesAtom, storage.getFavorites());
  set(updatePageAtom, pageId, { isFavorite });
  return isFavorite;
});

export const setSidebarOpenAtom = atom(null, (get, set, open: boolean) => {
  storage.setSidebarOpen(open);
  set(sidebarOpenAtom, open);
});

