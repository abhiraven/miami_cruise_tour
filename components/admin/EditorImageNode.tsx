"use client";

import { useEffect, useRef, useState } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import type { DOMOutputSpec } from "@tiptap/pm/model";

interface WidthPreset {
  label: string;
  value: string;
}

const WIDTH_PRESETS: WidthPreset[] = [
  { label: "25%", value: "25%" },
  { label: "50%", value: "50%" },
  { label: "75%", value: "75%" },
  { label: "Full", value: "100%" },
];

function ImageNodeView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [alt, setAlt] = useState<string>(node.attrs.alt || "");
  const [title, setTitle] = useState<string>(node.attrs.title || "");
  const [caption, setCaption] = useState<string>(node.attrs.caption || "");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAlt(node.attrs.alt || "");
    setTitle(node.attrs.title || "");
    setCaption(node.attrs.caption || "");
  }, [node.attrs.alt, node.attrs.title, node.attrs.caption]);

  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as globalThis.Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen]);

  function saveText() {
    updateAttributes({ alt, title, caption: caption.trim() || null });
  }

  function closePanel() {
    saveText();
    setPanelOpen(false);
  }

  const width = node.attrs.width || "100%";

  return (
    <NodeViewWrapper className="relative" data-drag-handle>
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        title={node.attrs.title || ""}
        style={{ width }}
        onClick={() => setPanelOpen((v) => !v)}
        className={`block max-w-full rounded-2xl cursor-pointer transition ${
          panelOpen ? "ring-2 ring-miami-navy" : ""
        }`}
      />

      {node.attrs.caption && !panelOpen && (
        <p className="mt-1.5 text-center text-xs italic text-miami-navy/60">{node.attrs.caption}</p>
      )}

      {panelOpen && (
        <div
          ref={panelRef}
          contentEditable={false}
          className="absolute left-0 top-full z-20 mt-2 w-80 rounded-xl border border-miami-mist bg-white p-3 shadow-lg"
        >
          <label className="block text-xs font-semibold text-miami-navy/70 mb-1">
            Alt Text <span className="font-normal text-miami-navy/40">(for accessibility &amp; SEO)</span>
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={saveText}
            placeholder="Describe this image"
            className="w-full rounded-lg border border-miami-mist px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
          />

          <label className="block text-xs font-semibold text-miami-navy/70 mb-1 mt-2.5">
            Title <span className="font-normal text-miami-navy/40">(shown as a tooltip on hover)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveText}
            placeholder="Optional"
            className="w-full rounded-lg border border-miami-mist px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
          />

          <label className="block text-xs font-semibold text-miami-navy/70 mb-1 mt-2.5">
            Caption <span className="font-normal text-miami-navy/40">(shown below the image)</span>
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={saveText}
            placeholder="Optional"
            className="w-full rounded-lg border border-miami-mist px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
          />

          <div className="mt-2.5">
            <label className="block text-xs font-semibold text-miami-navy/70 mb-1">Size</label>
            <div className="flex flex-wrap gap-1.5">
              {WIDTH_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => updateAttributes({ width: preset.value })}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    width === preset.value
                      ? "border-miami-navy bg-miami-navy text-white"
                      : "border-miami-mist text-miami-navy hover:bg-miami-mist/20"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => deleteNode()}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Delete Image
            </button>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-full bg-miami-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-miami-navy/90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        renderHTML: (attrs: any) => (attrs.width ? { style: `width: ${attrs.width}` } : {}),
        parseHTML: (element: HTMLElement) => element.style.width || element.getAttribute("width") || "100%",
      },
      caption: {
        default: null,
        renderHTML: () => ({}),
        parseHTML: (element: HTMLElement) =>
          element.closest("figure")?.querySelector("figcaption")?.textContent || null,
      },
    };
  },
  parseHTML() {
    return [
      // "ignore" tells Tiptap's HTML parser to skip the figcaption node entirely, since the
      // caption is already carried on the image node's own "caption" attribute above.
      { tag: "figure.editor-image-figure > figcaption", ignore: true } as any,
      ...(this.parent?.() ?? []),
    ];
  },
  renderHTML({ HTMLAttributes, node }: any): DOMOutputSpec {
    const img: DOMOutputSpec = ["img", HTMLAttributes];
    if (node.attrs.caption) {
      return ["figure", { class: "editor-image-figure" }, img, ["figcaption", {}, node.attrs.caption]];
    }
    return img;
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
