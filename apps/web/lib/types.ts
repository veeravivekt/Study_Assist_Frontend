import type { JSONContent } from "novel";

export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  parentId?: string;
  content: JSONContent;
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
  tags?: string[];
  archived?: boolean;
}

export interface PageTree extends Page {
  children?: PageTree[];
}

export interface PageMetadata {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
  tags?: string[];
}

export interface RecentPage {
  pageId: string;
  accessedAt: Date;
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  content: JSONContent;
  category?: string;
}

