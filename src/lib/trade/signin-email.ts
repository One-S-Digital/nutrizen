const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Sign-in email: a button for people, the plain link underneath for clients that block buttons. */
export function signInEmail(link: string, business: string): { subject: string; text: string; html: string } {
  const greeting = business ? `Hi ${business},` : "Hi,";
  const text = [
    greeting,
    "",
    "Use this link to sign in to the NutriZen trade order portal:",
    "",
    link,
    "",
    "The link works once and expires in 15 minutes. If you did not ask for it, ignore this email: nobody can sign in without it.",
    "",
    "NutriZen",
  ].join("\n");

  const href = escapeHtml(link);
  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f1ea;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px;font-family:Helvetica,Arial,sans-serif;color:#1f2a24;">
        <tr><td style="font-size:20px;font-weight:bold;padding-bottom:16px;">NutriZen Trade</td></tr>
        <tr><td style="font-size:16px;line-height:24px;padding-bottom:8px;">${escapeHtml(greeting)}</td></tr>
        <tr><td style="font-size:16px;line-height:24px;padding-bottom:24px;">Press the button to sign in to the trade order portal.</td></tr>
        <tr><td align="center" style="padding-bottom:24px;">
          <a href="${href}" style="display:inline-block;background:#4f6f3f;color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:12px;">Sign in to NutriZen Trade</a>
        </td></tr>
        <tr><td style="font-size:14px;line-height:21px;color:#5b6660;padding-bottom:16px;">The link works once and expires in 15 minutes. If you did not ask for it, ignore this email: nobody can sign in without it.</td></tr>
        <tr><td style="font-size:12px;line-height:18px;color:#8a938d;word-break:break-all;">Button not working? Copy this link into your browser:<br>${href}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: "Your NutriZen trade sign-in link", text, html };
}
