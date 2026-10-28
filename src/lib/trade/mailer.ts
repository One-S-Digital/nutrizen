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

/**
 * Sends through any SMTP mailbox (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD).
 * Returns false on failure. With no SMTP configured, outside production the email is
 * printed to the server console instead, so sign-in links can be followed in local development.
 */
export async function sendTradeMail(mail: Mail): Promise<boolean> {
  const mailer = getMailer();
  if (!mailer) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[trade] No SMTP configured. Email that would be sent:\nTo: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
      return true;
    }
    console.error("[trade] SMTP_HOST / SMTP_USER / SMTP_PASSWORD are not set. Email not sent.");
    return false;
  }
  try {
    await mailer.send.sendMail({ from: mailer.from, ...mail });
    return true;
  } catch (err) {
    console.error("[trade] Email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
