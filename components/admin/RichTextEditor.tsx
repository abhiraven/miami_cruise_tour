"use client";

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImage } from "./EditorImageNode";
import Placeholder from "@tiptap/extension-placeholder";
import MediaLibraryPicker from "./MediaLibraryPicker";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-miami-navy text-white"
          : "text-miami-navy hover:bg-miami-mist/30"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-6 w-px bg-miami-mist" aria-hidden="true" />;
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  uploadType?: string;
}

export default function RichTextEditor({ value, onChange, uploadType = "posts" }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkPanelPos, setLinkPanelPos] = useState({ top: 0, left: 0 });
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNofollow, setLinkNofollow] = useState(false);
  const [linkNewTab, setLinkNewTab] = useState(false);
  const linkPanelRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      ResizableImage.configure({ inline: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your post…" }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose-content rte-content min-h-[320px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current?.(editor.getHTML());
    },
  });

  const lastExternalValue = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== lastExternalValue.current && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
    lastExternalValue.current = value;
  }, [value, editor]);

  async function handleImageFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Image upload failed.");
        return;
      }
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const LINK_PANEL_WIDTH = 288;

  function openLinkPanel() {
    if (!editor) return;
    const attrs = editor.getAttributes("link");
    setLinkUrl(attrs.href || "");
    setLinkNofollow(String(attrs.rel || "").split(/\s+/).includes("nofollow"));
    setLinkNewTab(attrs.target === "_blank");

    const { from, to } = editor.state.selection;
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    const left = Math.min(start.left, end.left);
    const bottom = Math.max(start.bottom, end.bottom);
    setLinkPanelPos({
      top: bottom + 8,
      left: Math.min(Math.max(left, 8), window.innerWidth - LINK_PANEL_WIDTH - 8),
    });

    setLinkPanelOpen(true);
  }

  function applyLink() {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkPanelOpen(false);
      return;
    }
    const rel = [linkNofollow ? "nofollow" : null, "noopener", "noreferrer"].filter(Boolean).join(" ");
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, rel, target: linkNewTab ? "_blank" : null })
      .run();
    setLinkPanelOpen(false);
  }

  function removeLink() {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPanelOpen(false);
  }

  useEffect(() => {
    if (!linkPanelOpen) return;
    function handleClick(e: MouseEvent) {
      if (linkPanelRef.current && !linkPanelRef.current.contains(e.target as globalThis.Node)) {
        setLinkPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [linkPanelOpen]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-miami-mist bg-white">
      <div className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-miami-mist bg-miami-pearl px-2 py-1.5 shadow-sm">
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          ↶
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          ↷
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>
        <ToolbarButton title="Heading 4" active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
          H4
        </ToolbarButton>
        <ToolbarButton title="Heading 5" active={editor.isActive("heading", { level: 5 })} onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}>
          H5
        </ToolbarButton>
        <ToolbarButton title="Heading 6" active={editor.isActive("heading", { level: 6 })} onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}>
          H6
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          ••
        </ToolbarButton>
        <ToolbarButton title="Numbered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          12
        </ToolbarButton>
        <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </ToolbarButton>
        <ToolbarButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          ⟸
        </ToolbarButton>
        <ToolbarButton title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          ⟺
        </ToolbarButton>
        <ToolbarButton title="Align Right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          ⟹
        </ToolbarButton>

        <ToolbarDivider />

        <div className="relative">
          <ToolbarButton title="Insert Link" active={editor.isActive("link")} onClick={openLinkPanel}>
            🔗
          </ToolbarButton>
          {linkPanelOpen && (
            <div
              ref={linkPanelRef}
              style={{ position: "fixed", top: linkPanelPos.top, left: linkPanelPos.left }}
              className="z-50 w-72 rounded-xl border border-miami-mist bg-white p-3 shadow-lg"
            >
              <label className="block text-xs font-semibold text-miami-navy/70 mb-1">Link URL</label>
              <input
                type="text"
                autoFocus
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === "Escape") setLinkPanelOpen(false);
                }}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-miami-mist px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
              />

              <label className="mt-2.5 flex items-start gap-2 text-xs font-medium text-miami-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-miami-mist text-miami-navy focus:ring-miami-navy"
                />
                <span>
                  Open in new tab <code className="font-mono">target=&quot;_blank&quot;</code>
                  <span className="block text-[11px] font-normal text-miami-navy/40">
                    Visitors leave the link open in a new tab instead of navigating away from this page.
                  </span>
                </span>
              </label>

              <label className="mt-2.5 flex items-start gap-2 text-xs font-medium text-miami-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkNofollow}
                  onChange={(e) => setLinkNofollow(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-miami-mist text-miami-navy focus:ring-miami-navy"
                />
                <span>
                  Add <code className="font-mono">rel=&quot;nofollow&quot;</code>
                  <span className="block text-[11px] font-normal text-miami-navy/40">
                    Tells search engines not to pass SEO credit through this link — use it for sponsored, affiliate, or untrusted links.
                  </span>
                </span>
              </label>

              <div className="mt-3 flex items-center justify-between">
                {editor.isActive("link") ? (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Remove Link
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkPanelOpen(false)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-miami-navy/60 hover:bg-miami-mist/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyLink}
                    className="rounded-full bg-miami-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-miami-navy/90"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <ToolbarButton
          title="Insert Image"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "…" : "🖼️"}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageFile}
          className="hidden"
        />
        <ToolbarButton title="Insert from Media Library" onClick={() => setLibraryOpen(true)}>
          🗂️
        </ToolbarButton>
        {libraryOpen && (
          <MediaLibraryPicker
            folder={uploadType}
            onSelect={(url) => editor.chain().focus().setImage({ src: url }).run()}
            onClose={() => setLibraryOpen(false)}
          />
        )}

        <ToolbarDivider />

        {editor.isActive("table") ? (
          <>
            <ToolbarButton title="Add Column" onClick={() => editor.chain().focus().addColumnAfter().run()}>
              +Col
            </ToolbarButton>
            <ToolbarButton title="Delete Column" onClick={() => editor.chain().focus().deleteColumn().run()}>
              -Col
            </ToolbarButton>
            <ToolbarButton title="Add Row" onClick={() => editor.chain().focus().addRowAfter().run()}>
              +Row
            </ToolbarButton>
            <ToolbarButton title="Delete Row" onClick={() => editor.chain().focus().deleteRow().run()}>
              -Row
            </ToolbarButton>
            <ToolbarButton title="Delete Table" onClick={() => editor.chain().focus().deleteTable().run()}>
              ⊟
            </ToolbarButton>
          </>
        ) : (
          <ToolbarButton
            title="Insert Table"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            ⊞
          </ToolbarButton>
        )}

        <ToolbarDivider />

        <ToolbarButton title="Clear Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          ⨯
        </ToolbarButton>
      </div>

      <div className="px-4 py-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
