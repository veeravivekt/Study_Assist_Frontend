import { Node, mergeAttributes } from "@tiptap/core";

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>;
}

export type CalloutType = "info" | "warning" | "error" | "success";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Set a callout block
       */
      setCallout: (attributes?: { type?: CalloutType; icon?: string }) => ReturnType;
      /**
       * Toggle a callout block
       */
      toggleCallout: () => ReturnType;
    };
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: "callout",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "block+",

  group: "block",

  defining: true,

  addAttributes() {
    return {
      type: {
        default: "info",
        parseHTML: (element) => element.getAttribute("data-type") || "info",
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {};
          }
          return {
            "data-type": attributes.type,
          };
        },
      },
      icon: {
        default: "💡",
        parseHTML: (element) => element.getAttribute("data-icon") || "💡",
        renderHTML: (attributes) => {
          if (!attributes.icon) {
            return {};
          }
          return {
            "data-icon": attributes.icon,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            type: element.getAttribute("data-type") || "info",
            icon: element.getAttribute("data-icon") || "💡",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "callout",
        "data-callout-type": node.attrs.type || "info",
        "data-icon": node.attrs.icon || "💡",
        class: `callout callout-${node.attrs.type || "info"}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleCallout:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },
    };
  },
});

