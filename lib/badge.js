const { getIcon } = require("./icons");

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastColor(hex) {
  const rgb = hexToRgb(hex);
  return getLuminance(rgb) > 0.35 ? "#111111" : "#ffffff";
}

function generateBadge(options) {
  const {
    count = 0,
    label = "views",
    icon = null,
    color = "1DCB5C",
    textcolor = null,
    style = "pill",
    scale = 1,
    theme = "dark",
    labelcolor = null,
  } = options;

  const cleanColor = color.startsWith("#") ? color : `#${color}`;
  const autoText = textcolor
    ? textcolor.startsWith("#")
      ? textcolor
      : `#${textcolor}`
    : getContrastColor(cleanColor);

  const BASE = 14 * scale;
  const PADDING = 12 * scale;
  const GAP = 5 * scale;
  const ICON_SIZE = 12 * scale;
  const HEIGHT = 22 * scale;
  const FONT_SIZE = 11 * scale;
  const RADIUS =
    style === "pill" ? HEIGHT / 2 : style === "flat" ? 3 * scale : 0;

  const showLabel = label && label !== "false" && label !== "0";
  const showIcon = icon && icon !== "false" && icon !== "none";

  const countText = formatNumber(count);
  const labelText = showLabel ? label : "";

  const hasLabel = showLabel && labelText;
  const hasIcon = showIcon;

  const labelColor = labelcolor
    ? labelcolor.startsWith("#")
      ? labelcolor
      : `#${labelcolor}`
    : theme === "dark"
      ? "#161b22"
      : "#eaeef2";

  const labelTextColor = getContrastColor(labelColor);

  const charWidth = FONT_SIZE * 0.6;
  const countWidth = countText.length * charWidth + PADDING * 2;
  const labelWidth = hasLabel ? labelText.length * charWidth + PADDING * 2 : 0;
  const iconWidth = hasIcon ? ICON_SIZE + GAP : 0;

  const totalWidth =
    (hasLabel ? labelWidth : 0) +
    countWidth +
    (hasIcon && !hasLabel ? iconWidth : 0);

  const iconX = hasLabel ? labelWidth + PADDING : PADDING;
  const countX = hasLabel
    ? labelWidth + (hasIcon ? iconWidth + PADDING : PADDING)
    : hasIcon
      ? iconWidth + PADDING
      : PADDING;

  const iconSvg = hasIcon ? getIcon(icon, autoText, ICON_SIZE) : "";

  const bgRect = hasLabel
    ? `
      <rect width="${labelWidth}" height="${HEIGHT}" rx="${RADIUS}" fill="${labelColor}"/>
      <rect x="${labelWidth}" width="${countWidth + (hasIcon && !hasLabel ? iconWidth : 0)}" height="${HEIGHT}" rx="${RADIUS}" fill="${cleanColor}"/>
      <rect x="${labelWidth}" width="${RADIUS}" height="${HEIGHT}" fill="${cleanColor}"/>
      <rect width="${RADIUS}" height="${HEIGHT}" x="${labelWidth - RADIUS}" fill="${labelColor}"/>
    `
    : `<rect width="${totalWidth}" height="${HEIGHT}" rx="${RADIUS}" fill="${cleanColor}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${HEIGHT}" role="img" aria-label="${label}: ${countText}">
  <title>${label}: ${countText}</title>
  ${bgRect}
  ${hasLabel ? `<text x="${labelWidth / 2}" y="${HEIGHT / 2 + FONT_SIZE * 0.35}" font-family="'Segoe UI',Helvetica,Arial,sans-serif" font-size="${FONT_SIZE}" fill="${labelTextColor}" text-anchor="middle">${labelText}</text>` : ""}
  ${hasIcon ? `<svg x="${iconX}" y="${(HEIGHT - ICON_SIZE) / 2}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="${autoText}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</svg>` : ""}
  <text x="${countX + (hasIcon ? ICON_SIZE + GAP / 2 : 0)}" y="${HEIGHT / 2 + FONT_SIZE * 0.35}" font-family="'Segoe UI',Helvetica,Arial,sans-serif" font-size="${FONT_SIZE}" font-weight="600" fill="${autoText}" text-anchor="middle">${countText}</text>
</svg>`;
}

module.exports = { generateBadge };
