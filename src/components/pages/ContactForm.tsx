"use client";

import { useState, type FormEvent } from "react";

const defaultEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@nutrizen.co.za";

export default function ContactForm() {
  const [sentHint, setSentHint] = useState(false);

  /** Strip newlines and CR to prevent email header injection via mailto: URLs */
  function sanitizeMailto(input: string, maxLength = 500): string {
    return input.replace(/[\r\n]/g, " ").substring(0, maxLength);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = sanitizeMailto(String(fd.get("name") || "").trim());
    const email = sanitizeMailto(String(fd.get("email") || "").trim(), 254);
    const message = sanitizeMailto(String(fd.get("message") || "").trim(), 2000);
    const subject = encodeURIComponent(`NutriZen website: ${name || "Enquiry"}`);
    const body = encodeURIComponent(
      [name && `Name: ${name}`, email && `Email: ${email}`, "", message].filter(Boolean).join("\n")
    );
    window.location.href = `mailto:${defaultEmail}?subject=${subject}&body=${body}`;
    setSentHint(true);
  }

  return (
    <div className="rounded-[2rem] border border-neutral-light/90 bg-white/80 p-8 shadow-sm backdrop-blur-md md:p-10">
      <h2 className="text-xl font-semibold text-neutral-darkest">Send a message</h2>
      <p className="mt-2 text-sm text-neutral-dark">
        Share a few details and we will reply by email. You can also reach us directly at{" "}
        <a href={`mailto:${defaultEmail}`} className="font-medium text-primary hover:text-primary/90">
          {defaultEmail}
        </a>
        .
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-neutral-darkest">
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
          <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-darkest">
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
          <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-darkest">
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
        <button
          type="submit"
          className="w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-medium text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition-colors hover:bg-[#7a9d65] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
        >
          Open email to send
        </button>
        {sentHint ? (
          <p className="text-xs text-neutral-dark" role="status">
            If your mail app did not open, copy our address above or try again from a device with email set up.
          </p>
        ) : null}
      </form>
    </div>
  );
}
