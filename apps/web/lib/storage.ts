import type { Page } from "./types";

const STORAGE_KEYS = {
  PAGES: "novel__pages",
  CURRENT_PAGE_ID: "novel__current_page_id",
  FAVORITES: "novel__favorites",
  SIDEBAR_OPEN: "novel__sidebar_open",
} as const;

// Pages CRUD operations
export const storage = {
  // Get all pages
  getPages(): Page[] {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_KEYS.PAGES);
    if (!stored) return [];
    try {
      const pages = JSON.parse(stored);
      // Convert date strings back to Date objects
      return pages.map((page: Page) => ({
        ...page,
        createdAt: new Date(page.createdAt),
        updatedAt: new Date(page.updatedAt),
      }));
    } catch {
      return [];
    }
  },

  // Save all pages
  savePages(pages: Page[]): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
    } catch (error) {
      console.error("Failed to save pages:", error);
    }
  },

  // Get a single page by ID
  getPage(id: string): Page | null {
    const pages = this.getPages();
    return pages.find((p) => p.id === id) || null;
  },

  // Create a new page
  createPage(page: Omit<Page, "createdAt" | "updatedAt">): Page {
    const newPage: Page = {
      ...page,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const pages = this.getPages();
    pages.push(newPage);
    this.savePages(pages);
    return newPage;
  },

  // Update a page
  updatePage(id: string, updates: Partial<Page>): Page | null {
    const pages = this.getPages();
    const index = pages.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedPage: Page = {
      ...pages[index],
      ...updates,
      updatedAt: new Date(),
    };
    pages[index] = updatedPage;
    this.savePages(pages);
    return updatedPage;
  },

  // Delete a page
  deletePage(id: string): boolean {
    const pages = this.getPages();
    const filtered = pages.filter((p) => p.id !== id);
    if (filtered.length === pages.length) return false;
    this.savePages(filtered);
    return true;
  },

  // Get current page ID
  getCurrentPageId(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE_ID);
  },

  // Set current page ID
  setCurrentPageId(id: string | null): void {
    if (typeof window === "undefined") return;
    if (id) {
      window.localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE_ID, id);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE_ID);
    }
  },

  // Get favorites
  getFavorites(): string[] {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  // Toggle favorite
  toggleFavorite(pageId: string): boolean {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(pageId);
    const isFavorite = index === -1;
    if (isFavorite) {
      favorites.push(pageId);
    } else {
      favorites.splice(index, 1);
    }
    if (typeof window === "undefined") return isFavorite;
    window.localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return isFavorite;
  },

  // Get sidebar open state
  getSidebarOpen(): boolean {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
    return stored !== "false"; // Default to true
  },

  // Set sidebar open state
  setSidebarOpen(open: boolean): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, String(open));
  },
};

