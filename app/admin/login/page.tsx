"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    let cancelled = false;

    function renderWidget() {
      if (cancelled || !(window as any).turnstile || !widgetContainerRef.current) return;
      if (widgetIdRef.current !== null) return;
      widgetIdRef.current = (window as any).turnstile.render(widgetContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
      });
    }

    if ((window as any).turnstile) {
      renderWidget();
    } else {
      const existing = document.querySelector('script[src*="turnstile/v0/api.js"]');
      if (existing) {
        existing.addEventListener("load", renderWidget);
      } else {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.addEventListener("load", renderWidget);
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if ((window as any).turnstile && widgetIdRef.current !== null) {
        (window as any).turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  function resetCaptcha() {
    setCaptchaToken("");
    if ((window as any).turnstile && widgetIdRef.current !== null) {
      (window as any).turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setError("Please complete the verification challenge.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        resetCaptcha();
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-miami-mist bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-miami-navy">Admin Login</h1>
        <p className="mt-1 text-sm text-miami-navy/60">Sign in to manage the site.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-miami-navy mb-1">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-miami-navy mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
            />
          </div>

          {TURNSTILE_SITE_KEY && <div ref={widgetContainerRef} />}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || (Boolean(TURNSTILE_SITE_KEY) && !captchaToken)}
            className="w-full rounded-full bg-miami-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-miami-gold hover:text-miami-navy transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
