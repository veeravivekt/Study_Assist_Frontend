// Basic table extension - simplified version
// Note: Full table editing would require @tiptap/extension-table which has version conflicts
// This is a placeholder that can be enhanced later

import { Node, mergeAttributes } from "@tiptap/core";

export interface TableOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    table: {
      /**
       * Insert a table
       */
      insertTable: (options?: { rows?: number; cols?: number }) => ReturnType;
    };
  }
}

export const Table = Node.create<TableOptions>({
  name: "table",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  // Allow any content - tables will be inserted as HTML
  content: "",

  group: "block",

  atom: true,

  parseHTML() {
    return [{ tag: "table" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ["tbody", 0],
    ];
  },

  addCommands() {
    return {
      insertTable:
        (options?: { rows?: number; cols?: number }) =>
        ({ commands }) => {
          const rows = options?.rows || 2;
          const cols = options?.cols || 2;
          let tableHTML = "<table><tbody>";
          for (let i = 0; i < rows; i++) {
            tableHTML += "<tr>";
            for (let j = 0; j < cols; j++) {
              tableHTML += "<td></td>";
            }
            tableHTML += "</tr>";
          }
          tableHTML += "</tbody></table>";
          return commands.insertContent(tableHTML);
        },
    };
  },
});

