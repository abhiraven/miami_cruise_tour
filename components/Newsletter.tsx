"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

// Presentational-only signup card — mirrors the SpanishRidingSchoolTour
// reference's Newsletter.js UI structure. No backend call: submitting just
// shows a local success state. Wire this up to a real email provider
// (Mailchimp, Klaviyo, etc.) when one is available.
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="rounded-2xl border border-miami-mist bg-miami-ivory p-6">
      <h2 className="font-display text-lg font-bold text-miami-navy">Miami Boat Tour Tips</h2>
      <p className="mt-2 text-sm text-miami-gray">
        Get new guides, seasonal tips, and cruise updates straight to your inbox.
      </p>

      {submitted ? (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-miami-navy">
          <Icon name="check" className="h-4 w-4 shrink-0 text-miami-gold" />
          You&apos;re on the list — thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-full border border-miami-mist bg-white px-4 py-2.5 text-sm text-miami-onyx placeholder:text-miami-gray/60 focus:outline-none focus:ring-2 focus:ring-miami-gold/50"
          />
          <button type="submit" className="btn btn-gold w-full py-2.5 text-sm">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
