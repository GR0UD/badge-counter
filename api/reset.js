const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { id = "default", value = "0", secret } = req.query;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Pass ?secret=your_admin_secret" });
  }

  try {
    await redis.set(`badge:${id}`, parseInt(value));
    return res
      .status(200)
      .json({ id, value: parseInt(value), message: "Counter updated." });
  } catch (err) {
    return res.status(500).json({ error: "Redis error", details: err.message });
  }
};
