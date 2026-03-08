require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;

  // Server-side validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !emailRe.test(email.trim())) {
    return res.status(400).json({ error: "Valid email is required." });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }
  if (message.trim().length > 5000) {
    return res
      .status(400)
      .json({ error: "Message is too long (max 5000 chars)." });
  }

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeSubject = subject ? escapeHtml(subject.trim()) : "-";
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br/>");

  try {
    await resend.emails.send({
      from: "noreply@my-portofolio.com",
      to: process.env.TO_EMAIL,
      subject: `[Portfolio] ${subject ? subject.trim() : "New message from " + name.trim()}`,
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

    res.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
};
