import { Node, mergeAttributes } from "@tiptap/core";

export interface ToggleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    toggle: {
      /**
       * Set a toggle block
       */
      setToggle: (attributes?: { open?: boolean }) => ReturnType;
      /**
       * Toggle a toggle block
       */
      toggleToggle: () => ReturnType;
    };
  }
}

export const Toggle = Node.create<ToggleOptions>({
  name: "toggle",

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
      open: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-open") === "true",
        renderHTML: (attributes) => {
          if (!attributes.open) {
            return {
              "data-open": "false",
            };
          }
          return {
            "data-open": "true",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="toggle"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            open: element.getAttribute("data-open") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "toggle",
        "data-open": node.attrs.open ? "true" : "false",
        class: "toggle-block",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setToggle:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleToggle:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-t": () => this.editor.commands.toggleToggle(),
    };
  },
});

