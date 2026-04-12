import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const TURNSTILE_SECRET =
  process.env.TURNSTILE_SECRET_KEY ?? "1x0000000000000000000000000000000AA";
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "nutrizen.za@gmail.com";

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const token = fd.get("cf-turnstile-response") as string | null;

  // Verify Turnstile captcha
  if (!token) {
    return NextResponse.json(
      { error: "Please complete the captcha." },
      { status: 400 }
    );
  }

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

  // Extract form fields
  const name = (fd.get("name") as string | null)?.trim() ?? "";
  const email = (fd.get("email") as string | null)?.trim() ?? "";
  const message = (fd.get("message") as string | null)?.trim() ?? "";

  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }

  // Send via Gmail SMTP
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
    return NextResponse.json(
      { error: "Email service is not configured. Please contact us directly." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: gmailPass },
  });

  await transporter.sendMail({
    from: `"NutriZen Website" <${gmailUser}>`,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `New message from NutriZen website${name ? ` — ${name}` : ""}`,
    text: [
      name    && `Name:    ${name}`,
      `Email:   ${email}`,
      "",
      message,
    ].filter(Boolean).join("\n"),
    html: `
      <table style="font-family:sans-serif;font-size:14px;color:#333;border-collapse:collapse;width:100%;max-width:560px">
        ${name ? `<tr><td style="padding:6px 0;font-weight:600;width:80px">Name</td><td style="padding:6px 0">${name}</td></tr>` : ""}
        <tr><td style="padding:6px 0;font-weight:600">Email</td><td style="padding:6px 0"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td colspan="2" style="padding:16px 0 6px;font-weight:600">Message</td></tr>
        <tr><td colspan="2" style="padding:0;white-space:pre-wrap">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td></tr>
      </table>
    `,
  });

  return NextResponse.json({ success: true });
}
