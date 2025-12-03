"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useAtomValue, useSetAtom } from "jotai";
import { currentPageAtom, updatePageAtom } from "@/lib/atoms";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import { EditorBubble } from "novel";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

const TailwindAdvancedEditor = () => {
  const currentPage = useAtomValue(currentPageAtom);
  const updatePage = useSetAtom(updatePageAtom);
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();
  const [isSaving, setIsSaving] = useState(false);

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    if (!currentPage || !currentPage.id) {
      // No page selected, just save to localStorage
      const json = editor.getJSON();
      const html = highlightCodeblocks(editor.getHTML());
      const markdown = editor.storage.markdown.getMarkdown();
      window.localStorage.setItem("html-content", html);
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      window.localStorage.setItem("markdown", markdown);
      setSaveStatus("Saved (local only)");
      return;
    }

    const json = editor.getJSON();
    const html = highlightCodeblocks(editor.getHTML());
    const markdown = editor.storage.markdown.getMarkdown();
    
    setCharsCount(editor.storage.characterCount.words());
    
    // Update local storage as fallback
    window.localStorage.setItem("html-content", html);
    window.localStorage.setItem("novel-content", JSON.stringify(json));
    window.localStorage.setItem("markdown", markdown);

    // Update page atom with new content
    updatePage(currentPage.id, { content: json });

    // Send to backend API
    setIsSaving(true);
    try {
      const response = await fetch(`/api/pages/${currentPage.id}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: json,
          html: html,
          markdown: markdown,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error("Save error response:", errorData);
        throw new Error(`Failed to save: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      setSaveStatus("Saved");
    } catch (error) {
      console.error("Error saving to backend:", error);
      setSaveStatus("Save failed");
      // Content is still saved locally, so user can continue working
    } finally {
      setIsSaving(false);
    }
  }, 500);

  // Load content when page changes
  useEffect(() => {
    if (currentPage) {
      // Load content from current page
      if (currentPage.content && Object.keys(currentPage.content).length > 0) {
        setInitialContent(currentPage.content);
      } else {
        // Fallback to localStorage or default content
        const storedContent = window.localStorage.getItem("novel-content");
        if (storedContent) {
          try {
            setInitialContent(JSON.parse(storedContent));
          } catch {
            setInitialContent(defaultEditorContent);
          }
        } else {
          setInitialContent(defaultEditorContent);
        }
      }
    } else {
      // No page selected, use localStorage or default
      const storedContent = window.localStorage.getItem("novel-content");
      if (storedContent) {
        try {
          setInitialContent(JSON.parse(storedContent));
        } catch {
          setInitialContent(defaultEditorContent);
        }
      } else {
        setInitialContent(defaultEditorContent);
      }
    }
  }, [currentPage?.id]);

  if (!initialContent) return null;

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          {isSaving ? "Saving..." : saveStatus}
        </div>
        <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
          {charsCount} Words
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative flex-1 w-full max-w-4xl mx-auto px-8 py-16 border-muted bg-background"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
