const { Resend } = require("resend");

const DEFAULT_FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";

class ContactValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ContactValidationError";
  }
}

class ContactConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ContactConfigError";
  }
}

class ContactDeliveryError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "ContactDeliveryError";
    this.details = details;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeValue(value) {
  return String(value ?? "").trim();
}

function normalizeContactPayload(payload = {}) {
  const name = normalizeValue(payload.name);
  const email = normalizeValue(payload.email);
  const subject = normalizeValue(payload.subject);
  const message = normalizeValue(payload.message);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) {
    throw new ContactValidationError("Name is required.");
  }

  if (!emailRe.test(email)) {
    throw new ContactValidationError("Valid email is required.");
  }

  if (!message) {
    throw new ContactValidationError("Message is required.");
  }

  if (message.length > 5000) {
    throw new ContactValidationError("Message is too long (max 5000 chars).");
  }

  return { name, email, subject, message };
}

function getContactEmailConfig(env = process.env) {
  const resendApiKey = normalizeValue(env.RESEND_API_KEY);
  const toEmail = normalizeValue(env.TO_EMAIL);
  const fromEmail = normalizeValue(env.FROM_EMAIL) || DEFAULT_FROM_EMAIL;

  if (!resendApiKey) {
    throw new ContactConfigError("Missing RESEND_API_KEY environment variable");
  }

  if (!toEmail) {
    throw new ContactConfigError("Missing TO_EMAIL environment variable");
  }

  return { resendApiKey, toEmail, fromEmail };
}

function buildContactEmailRequest(payload, config) {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = payload.subject ? escapeHtml(payload.subject) : "-";
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br/>");

  return {
    from: config.fromEmail,
    to: config.toEmail,
    replyTo: payload.email,
    subject: `[Portfolio] ${payload.subject || "New message from " + payload.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 16px;">New Contact Form Message</h2>
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
  };
}

async function sendContactEmail(payload, options = {}) {
  const normalizedPayload = normalizeContactPayload(payload);
  const config = getContactEmailConfig(options.env);
  const resend =
    options.resend || new Resend(config.resendApiKey);

  const { data, error } = await resend.emails.send(
    buildContactEmailRequest(normalizedPayload, config),
  );

  if (error) {
    throw new ContactDeliveryError("Resend API error", error);
  }

  return {
    id: data?.id ?? null,
  };
}

module.exports = {
  ContactConfigError,
  ContactDeliveryError,
  ContactValidationError,
  DEFAULT_FROM_EMAIL,
  buildContactEmailRequest,
  getContactEmailConfig,
  normalizeContactPayload,
  sendContactEmail,
};
