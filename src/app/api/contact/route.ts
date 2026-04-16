import { NextRequest, NextResponse } from "next/server";

const TURNSTILE_SECRET =
  process.env.TURNSTILE_SECRET_KEY ?? "1x0000000000000000000000000000000AA";
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "nutrizen.za@gmail.com";

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const token = fd.get("cf-turnstile-response") as string | null;

  if (!token) {
    return NextResponse.json(
      { error: "Please complete the captcha." },
      { status: 400 }
    );
  }

  // Verify Turnstile captcha
  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
      }),
    }
  );
  const verify = (await verifyRes.json()) as { success: boolean };

  if (!verify.success) {
    return NextResponse.json(
      { error: "Captcha verification failed. Please try again." },
      { status: 400 }
    );
  }

  // Forward to FormSubmit
  fd.delete("cf-turnstile-response");
  fd.set("_subject", "New message from NutriZen website");
  fd.set("_captcha", "false");
  fd.set("_template", "table");

  const submitRes = await fetch(
    `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    }
  );

  const submitData = (await submitRes.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };

  const ok =
    submitRes.ok &&
    submitData.success !== "false" &&
    submitData.success !== false;

  if (!ok) {
    console.error("[contact] FormSubmit error:", submitRes.status, submitData);
    // FormSubmit returns success:false when the email address hasn't been
    // activated yet — the activation link is sent to the inbox on first use.
    const msg =
      submitData.message ?? "Failed to send message. Please try again.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
