import sanitizeHtml from "sanitize-html";

// Sanitizes blog post body HTML before it's rendered with
// dangerouslySetInnerHTML on /blog/[slug]. Post content comes from the
// admin Tiptap editor (see components/admin/PostForm.tsx and its
// @tiptap/* extensions), so this only needs to allow what that editor can
// actually produce -- paragraphs, headings, lists, tables, links, images,
// basic text formatting, and the inline `style`/`class` attributes Tiptap
// uses for text alignment -- while still stripping anything unexpected
// (scripts, iframes, event-handler attributes, javascript: URLs) as
// defense in depth against a compromised admin account or a bad paste.
//
// This replaced a jsdom-based sanitizer (isomorphic-dompurify). jsdom's
// own dependency tree turned out to keep pulling in ESM-only packages
// (first @exodus/bytes, then @csstools/css-calc via cssstyle) that
// Vercel's production Node runtime can't require() -- crashing every
// single blog post page with a 500. sanitize-html has no DOM/jsdom
// dependency at all, so that entire class of crash isn't possible here.
const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "code",
  "pre",
  "sub",
  "sup",
  "span",
  "div",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan"],
    "*": ["style", "class"],
  },
  // Only the handful of inline styles Tiptap's extensions actually emit
  // (text alignment, table column widths) -- not a blanket allow, which
  // would let arbitrary CSS (including exfiltration-style tricks) through
  // the `style` attribute.
  allowedStyles: {
    "*": {
      "text-align": [/^left$|^right$|^center$|^justify$/],
      width: [/^\d+(?:px|%)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  // Anchors always get a safe `rel` when they carry a `target`, same
  // protection DOMPurify applied by default.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

export function sanitizePostContent(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, sanitizeOptions);
}
