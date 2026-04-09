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
  return getLuminance(rgb) > 0.35 ? "#0a3d1a" : "#ffffff";
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

  const PADDING = 14 * scale;
  const GAP = 6 * scale;
  const ICON_SIZE = 14 * scale;
  const HEIGHT = 26 * scale;
  const FONT_SIZE = 11 * scale;
  const RADIUS =
    style === "pill" ? HEIGHT / 2 : style === "flat" ? 3 * scale : 0;

  const hasLabel = label && label !== "false" && label !== "none";
  const hasIcon = icon && icon !== "false" && icon !== "none";

  const countText = formatNumber(count);

  const labelBg = labelcolor
    ? labelcolor.startsWith("#")
      ? labelcolor
      : `#${labelcolor}`
    : theme === "dark"
      ? "#161b22"
      : "#eaeef2";

  const labelTextColor = theme === "dark" ? "#9ca3af" : "#57606a";

  const charWidth = FONT_SIZE * 0.62;
  const countTextWidth = countText.length * charWidth;
  const labelTextWidth = hasLabel ? label.length * charWidth : 0;

  const labelSectionW = hasLabel ? labelTextWidth + PADDING * 2 : 0;
  const rightInner = (hasIcon ? ICON_SIZE + GAP : 0) + countTextWidth;
  const rightSectionW = rightInner + PADDING * 2;
  const totalWidth = labelSectionW + rightSectionW;

  const midY = HEIGHT / 2;
  const textY = midY + FONT_SIZE * 0.38;

  const iconX = labelSectionW + PADDING;
  const countX =
    labelSectionW +
    PADDING +
    (hasIcon ? ICON_SIZE + GAP : 0) +
    countTextWidth / 2;

  const iconContent = hasIcon ? getIcon(icon, autoText, ICON_SIZE) : "";

  let bg = "";
  if (hasLabel) {
    bg = `
      <rect width="${totalWidth}" height="${HEIGHT}" rx="${RADIUS}" fill="${cleanColor}"/>
      <rect width="${labelSectionW}" height="${HEIGHT}" rx="${RADIUS}" fill="${labelBg}"/>
      <rect x="${labelSectionW - RADIUS}" width="${RADIUS}" height="${HEIGHT}" fill="${labelBg}"/>
    `;
  } else {
    bg = `<rect width="${totalWidth}" height="${HEIGHT}" rx="${RADIUS}" fill="${cleanColor}"/>`;
  }

  const labelEl = hasLabel
    ? `<text x="${labelSectionW / 2}" y="${textY}" font-family="'Segoe UI',Helvetica,Arial,sans-serif" font-size="${FONT_SIZE}" fill="${labelTextColor}" text-anchor="middle">${label}</text>`
    : "";

  const iconEl = hasIcon
    ? `<svg x="${iconX}" y="${midY - ICON_SIZE / 2}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="${autoText}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconContent}</svg>`
    : "";

  const countEl = `<text x="${countX}" y="${textY}" font-family="'Segoe UI',Helvetica,Arial,sans-serif" font-size="${FONT_SIZE}" font-weight="600" fill="${autoText}" text-anchor="middle">${countText}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${HEIGHT}" role="img" aria-label="${hasLabel ? label + ": " : ""}${countText}">
  <title>${hasLabel ? label + ": " : ""}${countText}</title>
  ${bg}
  ${labelEl}
  ${iconEl}
  ${countEl}
</svg>`;
}

module.exports = { generateBadge };
