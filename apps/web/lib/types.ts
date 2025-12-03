import type { JSONContent } from "novel";

export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  content: JSONContent;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  archived?: boolean;
}

export interface PageMetadata {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  content: JSONContent;
  category?: string;
}

