const {
  ContactConfigError,
  ContactDeliveryError,
  ContactValidationError,
  sendContactEmail,
} = require("./_lib/contact-email");

// ponytail: per-instance memory only. Good enough for one warm function;
// move to Vercel KV / Upstash if abuse spans instances.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    if (hits.size > 1000) {
      for (const [key, value] of hits) {
        if (now - value.start > WINDOW_MS) hits.delete(key);
      }
    }
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_HITS;
}

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

  const ip =
    req.headers?.["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", String(WINDOW_MS / 1000));
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  let body;
  try {
    body = req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body." });
  }

  try {
    const { id } = await sendContactEmail(body);

    return res.status(200).json({ success: true, id });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(400).json({ error: "Invalid JSON body." });
    }

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
