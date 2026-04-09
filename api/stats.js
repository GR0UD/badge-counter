const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { id = "default" } = req.query;

  try {
    const count = parseInt(await redis.get(`badge:${id}`)) || 0;
    return res.status(200).json({ id, count });
  } catch (err) {
    return res.status(500).json({ error: "Redis error", details: err.message });
  }
};
