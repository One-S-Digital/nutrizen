import nodemailer, { type Transporter } from "nodemailer";

type Mail = { to: string; subject: string; text: string; replyTo?: string };

let cached: { send: Transporter; from: string } | null | undefined;

function getMailer() {
  if (cached !== undefined) return cached;
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const port = Number(process.env.SMTP_PORT) || 465;
  cached =
    host && user && pass
      ? {
          send: nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // implicit TLS on 465, STARTTLS on other ports
            auth: { user, pass },
            // Fail in seconds, not minutes: a buyer is waiting on the order screen.
            connectionTimeout: 10_000,
            greetingTimeout: 10_000,
            socketTimeout: 20_000,
          }),
          from: `"NutriZen Trade" <${user}>`,
        }
      : null;
  return cached;
}

// Some hosts (Render among them) block outbound SMTP, so Resend's HTTPS API is preferred.
async function sendWithResend(apiKey: string, mail: Mail): Promise<boolean> {
  const from = process.env.RESEND_FROM?.trim() || "NutriZen Trade <hello@nutrizen.co.za>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error(`[trade] Email failed: Resend answered HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return false;
    }
    console.log(`[trade] Resend accepted "${mail.subject}"`);
    return true;
  } catch (err) {
    console.error("[trade] Email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Sends through Resend when RESEND_API_KEY is set (sender: RESEND_FROM), otherwise through
 * any SMTP mailbox (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD). Returns false on
 * failure. With neither configured, outside production the email is printed to the server
 * console instead, so sign-in links can be followed in local development.
 */
export async function sendTradeMail(mail: Mail): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) return sendWithResend(resendKey, mail);
  const mailer = getMailer();
  if (!mailer) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[trade] No SMTP configured. Email that would be sent:\nTo: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
      return true;
    }
    console.error("[trade] Neither RESEND_API_KEY nor SMTP_HOST / SMTP_USER / SMTP_PASSWORD is set. Email not sent.");
    return false;
  }
  try {
    const info = await mailer.send.sendMail({ from: mailer.from, ...mail });
    console.log(`[trade] SMTP server accepted "${mail.subject}": ${info.response}`);
    return true;
  } catch (err) {
    console.error("[trade] Email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
