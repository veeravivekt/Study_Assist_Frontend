import { Node, mergeAttributes } from "@tiptap/core";

export interface BookmarkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bookmark: {
      /**
       * Set a bookmark block
       */
      setBookmark: (attributes: { url: string; title?: string; description?: string }) => ReturnType;
    };
  }
}

export const Bookmark = Node.create<BookmarkOptions>({
  name: "bookmark",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",

  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-url"),
        renderHTML: (attributes) => {
          if (!attributes.url) {
            return {};
          }
          return {
            "data-url": attributes.url,
          };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-title"),
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return {
            "data-title": attributes.title,
          };
        },
      },
      description: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-description"),
        renderHTML: (attributes) => {
          if (!attributes.description) {
            return {};
          }
          return {
            "data-description": attributes.description,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="bookmark"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            url: element.getAttribute("data-url"),
            title: element.getAttribute("data-title"),
            description: element.getAttribute("data-description"),
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "bookmark",
        class: "bookmark-block",
      }),
      [
        "a",
        {
          href: node.attrs.url,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "bookmark-link",
        },
        node.attrs.title || node.attrs.url,
      ],
    ];
  },

  addCommands() {
    return {
      setBookmark:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});

