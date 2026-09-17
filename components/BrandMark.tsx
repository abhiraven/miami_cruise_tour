// The Miami Cruise & Boat Tour mark: a crescent moon over a single
// arched bridge spanning open water — a boat tour + a bay causeway +
// the water itself, in one small glyph. Renders in `currentColor` so it
// picks up whatever text color class it's given (gold on the navy header/
// footer, navy on light admin surfaces, etc.) and stays crisp at any size
// since it's vector, not a raster logo file.
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
      {/* bridge deck */}
      <path d="M8 41.5h30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* bridge arch */}
      <path
        d="M12 41.5c0-11 7.5-18 13.5-18s13.5 7 13.5 18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* support struts */}
      <path d="M19 30.5v11M32 24.5v17" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      {/* crescent moon */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46 8a10 10 0 1 0 8.4 15.4A8 8 0 0 1 46 8Z"
        fill="currentColor"
      />
    </svg>
  );
}
