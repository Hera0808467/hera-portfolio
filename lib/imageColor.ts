export type HSV = {
  /** Hue in [0, 1) */
  h: number;
  /** Saturation in [0, 1] */
  s: number;
  /** Value in [0, 1] */
  v: number;
};

const hsvCache = new Map<string, HSV | null>();

function rgbToHsv(r: number, g: number, b: number): HSV {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rr) h = ((gg - bb) / delta) % 6;
    else if (max === gg) h = (bb - rr) / delta + 2;
    else h = (rr - gg) / delta + 4;
    h /= 6;
    if (h < 0) h += 1;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s, v };
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";

  // Same-origin assets (from /public) don't need CORS, but keep this safe if you later point to CDN.
  img.crossOrigin = "anonymous";

  const finalSrc = src.startsWith("/") ? src : `/${src}`;

  return await new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${finalSrc}`));
    img.src = finalSrc;
  });
}

/**
 * Best-effort average HSV for a cover image.
 * Used to drive the background shader hue/saturation.
 */
export async function getImageHSV(src: string): Promise<HSV | null> {
  if (typeof window === "undefined") return null;
  if (!src) return null;

  const cached = hsvCache.get(src);
  if (cached !== undefined) return cached;

  try {
    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    const w = 32;
    const h = 32;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    const data = ctx.getImageData(0, 0, w, h).data;

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    // Ignore very transparent pixels.
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 125) continue;
      r += data[i + 0];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    if (count === 0) {
      hsvCache.set(src, null);
      return null;
    }

    const hsv = rgbToHsv(r / count, g / count, b / count);
    hsvCache.set(src, hsv);
    return hsv;
  } catch {
    hsvCache.set(src, null);
    return null;
  }
}

