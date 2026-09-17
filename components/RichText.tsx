// Lightweight markdown-ish renderer for longer editable text blocks (like
// Privacy Policy sections): blank-line-separated paragraphs, "- " bullet
// groups, and **bold** spans.
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  );
}

export default function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = String(text || "")
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const isBulletBlock = lines.length > 0 && lines.every((l) => l.startsWith("- "));

        if (isBulletBlock) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.replace(/^-\s+/, ""), `li-${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }

        if (block.startsWith("## ")) {
          return <h3 key={i}>{block.replace(/^##\s+/, "")}</h3>;
        }

        return <p key={i}>{renderInline(block, `p-${i}`)}</p>;
      })}
    </div>
  );
}
