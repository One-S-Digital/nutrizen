"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@nutrizen.co.za";

type Status = "idle" | "sending" | "sent" | "error";

declare global {
  interface Window {
    turnstile?: { reset: (widgetId?: string) => void };
  }
}

export default function ContactForm({ siteKey }: { siteKey: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const data = (await res.json()) as { error?: string };
      if (res.ok) {
        setStatus("sent");
        form.reset();
        window.turnstile?.reset();
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        window.turnstile?.reset();
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
      window.turnstile?.reset();
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div className="rounded-[2rem] border border-neutral-light/90 bg-white/80 p-8 shadow-sm backdrop-blur-md md:p-10">
        <h2 className="text-xl font-semibold text-neutral-darkest">Send a message</h2>
        <p className="mt-2 text-sm text-neutral-dark">
          Share a few details and we will reply by email. You can also reach us directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary hover:text-primary/90"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>

        {status === "sent" ? (
          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <p className="text-base font-semibold text-neutral-darkest">Message sent!</p>
            <p className="mt-1 text-sm text-neutral-dark">
              Thanks for reaching out — we&apos;ll get back to you within 1–2 business days.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm font-medium text-primary hover:text-primary/80"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-neutral-darkest"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-1.5 w-full rounded-2xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest shadow-sm placeholder:text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-neutral-darkest"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 w-full rounded-2xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest shadow-sm placeholder:text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-neutral-darkest"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                className="mt-1.5 w-full resize-y rounded-2xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest shadow-sm placeholder:text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                placeholder="How can we help?"
              />
            </div>

            {/* Cloudflare Turnstile widget */}
            <div
              className="cf-turnstile"
              data-sitekey={siteKey}
              data-theme="light"
            />

            {status === "error" && (
              <p className="text-sm text-red-600" role="alert">
                {errorMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-medium text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition-colors hover:bg-[#7a9d65] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
