// The Miami Cruise & Boat Tour mark: a sailboat on the water under a
// rising sun — a boat tour, open water, and Miami's golden-hour light in
// one small glyph. Renders in `currentColor` so it picks up whatever text
// color class it's given (gold on the navy header/footer, navy on light
// admin surfaces, etc.) and stays crisp at any size since it's vector,
// not a raster logo file.
export default function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* water ripples */}
      <path
        d="M8 50c4-2.5 8-2.5 12 0s8 2.5 12 0 8-2.5 12 0 8 2.5 12 0"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M8 56c4-2.5 8-2.5 12 0s8 2.5 12 0 8-2.5 12 0 8 2.5 12 0"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* boat hull */}
      <path
        d="M13 42.5h30l-4 7.5H17l-4-7.5Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* mast */}
      <line x1="28" y1="42.5" x2="28" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* sail */}
      <path d="M29.5 17c7.5 2 11.5 8 11.5 22.5h-11.5V17Z" fill="currentColor" />
      {/* rising sun */}
      <circle cx="47" cy="14" r="7" fill="currentColor" />
    </svg>
  );
}
