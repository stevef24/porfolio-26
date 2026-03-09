export type ShaderColor = [number, number, number, number];

const FALLBACK_SHADER_COLOR: ShaderColor = [0, 0, 0, 1];

export function parseShaderColor(color: string): ShaderColor | null {
  const normalized = color.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("#")) {
    return parseHexColor(normalized);
  }

  if (normalized.toLowerCase().startsWith("rgb")) {
    return parseRgbColor(normalized);
  }

  return null;
}

export function resolveCssColorToShaderColor(
  color: string,
  fallback: ShaderColor = FALLBACK_SHADER_COLOR
): ShaderColor {
  const directColor = parseShaderColor(color);
  if (directColor) {
    return directColor;
  }

  if (typeof document === "undefined" || !document.body) {
    return fallback;
  }

  const probe = document.createElement("div");
  probe.dataset.shaderProbe = "true";
  probe.style.color = color;
  probe.style.display = "none";

  document.body.appendChild(probe);
  const resolvedColor = getComputedStyle(probe).color;
  probe.remove();

  return parseShaderColor(resolvedColor) ?? fallback;
}

export function readCssColorTokenAsShaderColor(
  styles: CSSStyleDeclaration,
  token: string,
  fallbackColor: string
): ShaderColor {
  const fallback = parseShaderColor(fallbackColor) ?? FALLBACK_SHADER_COLOR;
  const rawColor = styles.getPropertyValue(token).trim();

  if (!rawColor) {
    return fallback;
  }

  return resolveCssColorToShaderColor(rawColor, fallback);
}

export function shaderColorToCssString(color: ShaderColor): string {
  const [r, g, b, a] = color;
  const red = Math.round(clamp(r, 0, 1) * 255);
  const green = Math.round(clamp(g, 0, 1) * 255);
  const blue = Math.round(clamp(b, 0, 1) * 255);
  const alpha = clamp(a, 0, 1);

  if (alpha >= 0.999) {
    return `rgb(${red}, ${green}, ${blue})`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${trimAlpha(alpha)})`;
}

function parseHexColor(color: string): ShaderColor | null {
  let hex = color.slice(1);

  if (![3, 4, 6, 8].includes(hex.length)) {
    return null;
  }

  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((value) => value + value)
      .join("");
  }

  if (hex.length === 6) {
    hex = `${hex}ff`;
  }

  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
    parseInt(hex.slice(6, 8), 16) / 255,
  ];
}

function parseRgbColor(color: string): ShaderColor | null {
  const match = color.match(
    /^rgba?\(\s*([0-9.]+)\s*(?:,\s*|\s+)([0-9.]+)\s*(?:,\s*|\s+)([0-9.]+)(?:\s*(?:,|\/)\s*([0-9.]+%?))?\s*\)$/i
  );

  if (!match) {
    return null;
  }

  return [
    clamp(Number(match[1]) / 255, 0, 1),
    clamp(Number(match[2]) / 255, 0, 1),
    clamp(Number(match[3]) / 255, 0, 1),
    parseAlpha(match[4]),
  ];
}

function parseAlpha(alpha: string | undefined): number {
  if (!alpha) {
    return 1;
  }

  if (alpha.endsWith("%")) {
    return clamp(Number(alpha.slice(0, -1)) / 100, 0, 1);
  }

  return clamp(Number(alpha), 0, 1);
}

function trimAlpha(alpha: number): string {
  return alpha.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
