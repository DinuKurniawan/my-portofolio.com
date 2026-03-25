const {
  ContactConfigError,
  ContactDeliveryError,
  ContactValidationError,
  sendContactEmail,
} = require("./_lib/contact-email");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = await sendContactEmail(req.body);

    return res.status(200).json({ success: true, id });
  } catch (err) {
    if (err instanceof ContactValidationError) {
      return res.status(400).json({ error: err.message });
    }

    if (err instanceof ContactConfigError) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Server configuration error. Please contact the admin." });
    }

    if (err instanceof ContactDeliveryError) {
      console.error("Resend API error:", err.details);
    } else {
      console.error("Unexpected error:", err);
    }

    return res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
};
