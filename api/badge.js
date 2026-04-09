const { Redis } = require("@upstash/redis");
const { generateBadge } = require("../lib/badge");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const WINDOW_HOURS = 24;

function getIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const {
    id = "default",
    label = "views",
    icon,
    color = "1DCB5C",
    textcolor,
    labelcolor,
    style = "pill",
    scale = "1",
    theme = "dark",
    nocount,
  } = req.query;

  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    res.setHeader("Content-Type", "image/svg+xml");
    const svg = generateBadge({
      count: 0,
      label: "setup required",
      color: "ff4444",
      style,
      scale: parseFloat(scale),
      theme,
    });
    return res.status(200).send(svg);
  }

  let count = 0;
  try {
    if (nocount === "true") {
      count = parseInt(await redis.get(`badge:${id}`)) || 0;
    } else {
      const ip = getIP(req);
      const rateLimitKey = `ratelimit:${id}:${ip}`;

      const alreadySeen = await redis.get(rateLimitKey);

      if (!alreadySeen) {
        const [newCount] = await Promise.all([
          redis.incr(`badge:${id}`),
          redis.set(rateLimitKey, "1", { ex: WINDOW_HOURS * 60 * 60 }),
        ]);
        count = newCount;
      } else {
        count = parseInt(await redis.get(`badge:${id}`)) || 0;
      }
    }
  } catch (err) {
    console.error("Redis error:", err);
    count = 0;
  }

  const svg = generateBadge({
    count,
    label: label === "false" ? null : label,
    icon: icon === "false" ? null : icon,
    color,
    textcolor,
    labelcolor,
    style,
    scale: Math.min(Math.max(parseFloat(scale) || 1, 0.5), 3),
    theme,
  });

  res.setHeader("Content-Type", "image/svg+xml");
  return res.status(200).send(svg);
};
