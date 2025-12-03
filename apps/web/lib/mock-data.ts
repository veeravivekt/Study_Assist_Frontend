import type { Page, PageTemplate } from "./types";
import { defaultEditorContent } from "./content";

// Helper function to create a page
export const createMockPage = (
  id: string,
  title: string,
  options?: Partial<Page>
): Page => ({
  id,
  title,
  content: defaultEditorContent,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...options,
});

// Build initial mock pages
export const getInitialMockPages = (): Page[] => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return [
    createMockPage("1", "Getting Started", {
      icon: "🚀",
      createdAt: lastWeek,
      updatedAt: yesterday,
    }),
    createMockPage("2", "Project Ideas", {
      icon: "💡",
      createdAt: yesterday,
      updatedAt: yesterday,
    }),
    createMockPage("3", "Meeting Notes", {
      icon: "📝",
      createdAt: yesterday,
      updatedAt: now,
      tags: ["meetings", "work"],
    }),
    createMockPage("4", "Personal", {
      icon: "👤",
      createdAt: lastWeek,
      updatedAt: lastWeek,
    }),
    createMockPage("5", "Goals 2024", {
      icon: "🎯",
      createdAt: lastWeek,
      updatedAt: yesterday,
    }),
    createMockPage("6", "Reading List", {
      icon: "📚",
      createdAt: yesterday,
      updatedAt: now,
    }),
    createMockPage("7", "Work", {
      icon: "💼",
      createdAt: lastWeek,
      updatedAt: lastWeek,
    }),
    createMockPage("8", "Team Projects", {
      icon: "👥",
      createdAt: yesterday,
      updatedAt: now,
      tags: ["work", "team"],
    }),
  ];
};

// Templates
export const getPageTemplates = (): PageTemplate[] => [
  {
    id: "blank",
    name: "Blank",
    description: "Start with a blank page",
    icon: "📄",
    content: {
      type: "doc",
      content: [],
    },
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    description: "Template for taking meeting notes",
    icon: "📝",
    category: "Work",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Meeting Notes" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Date: " },
            { type: "text", text: new Date().toLocaleDateString() },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Attendees" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Team member 1" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Agenda" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Topic 1" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Action Items" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Action item 1" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "project-plan",
    name: "Project Plan",
    description: "Template for project planning",
    icon: "📋",
    category: "Work",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Project Plan" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Project description goes here..." }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Goals" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Goal 1" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Timeline" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Phase 1: Planning" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "reading-list",
    name: "Reading List",
    description: "Template for tracking books and articles",
    icon: "📚",
    category: "Personal",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Reading List" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Book/Article 1" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

