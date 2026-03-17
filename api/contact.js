const { Resend } = require("resend");

// ── Escape HTML to prevent XSS in email body ─────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Guard: pastikan env vars tersedia
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable");
    return res.status(500).json({ error: "Server configuration error. Please contact the admin." });
  }
  if (!process.env.TO_EMAIL) {
    console.error("Missing TO_EMAIL environment variable");
    return res.status(500).json({ error: "Server configuration error. Please contact the admin." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Parse body (Vercel sudah otomatis parse JSON)
  const body = req.body || {};
  const { name, email, subject, message } = body;

  // Server-side validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !emailRe.test(String(email).trim())) {
    return res.status(400).json({ error: "Valid email is required." });
  }
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: "Message is required." });
  }
  if (String(message).trim().length > 5000) {
    return res.status(400).json({ error: "Message is too long (max 5000 chars)." });
  }

  const safeName    = escapeHtml(String(name).trim());
  const safeEmail   = escapeHtml(String(email).trim());
  const safeSubject = subject ? escapeHtml(String(subject).trim()) : "-";
  const safeMessage = escapeHtml(String(message).trim()).replace(/\n/g, "<br/>");

  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.TO_EMAIL,
      replyTo: String(email).trim(),
      subject: `[Portfolio] ${subject ? String(subject).trim() : "New message from " + String(name).trim()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">📬 New Contact Form Message</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #555; width: 100px;"><strong>Name</strong></td>
              <td style="padding: 8px 0;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Email</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #4f46e5;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Subject</strong></td>
              <td style="padding: 8px 0;">${safeSubject}</td>
            </tr>
          </table>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #ddd;"/>
          <p style="color: #555; margin-bottom: 8px;"><strong>Message:</strong></p>
          <p style="background: #fff; padding: 16px; border-radius: 6px; border-left: 4px solid #4f46e5; color: #333; line-height: 1.6;">
            ${safeMessage}
          </p>
          <p style="color: #aaa; font-size: 12px; margin-top: 24px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return res.status(500).json({ error: "Failed to send email. Please try again later." });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
};
