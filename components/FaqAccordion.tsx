"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import type { FaqItem } from "@/lib/home-content";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-miami-mist">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="border-b border-miami-mist last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-miami-navy"
              aria-expanded={open}
            >
              <span>{item.q}</span>
              <Icon
                name="plus"
                className={`h-4 w-4 shrink-0 text-miami-gold transition-transform duration-200 ${open ? "rotate-45" : ""}`}
              />
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-300"
              style={{ maxHeight: open ? "400px" : "0px" }}
            >
              <p className="pb-5 text-sm leading-relaxed text-miami-gray">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
