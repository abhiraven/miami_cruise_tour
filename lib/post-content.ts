// Blog post content helper functions

export function looksLikeHtml(content: string | null | undefined): boolean {
  return /<\/?(p|h1|h2|h3|h4|ul|ol|li|blockquote|strong|em|a|img|br|hr|table|thead|tbody|tr|td|th)[\s>]/i.test(
    String(content || "")
  );
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineMarkdownToHtml(text: string): string {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export function legacyTextToHtml(content: string | null | undefined): string {
  const blocks = String(content || "")
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${inlineMarkdownToHtml(block.replace(/^##\s+/, ""))}</h2>`;
      }
      return `<p>${inlineMarkdownToHtml(block)}</p>`;
    })
    .join("\n");
}

export function contentToHtml(content: string | null | undefined): string {
  if (!content) return "";
  return looksLikeHtml(content) ? content : legacyTextToHtml(content);
}
