"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  Clock
} from "three";

type ShaderBackgroundProps = {
  className?: string;
  style?: CSSProperties;

  rotation?: number;
  autoRotate?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;

  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;

  baseHue?: number;
  hueRange?: number;
  saturation?: number;
  originalMix?: number;

  onReady?: () => void;
};

const FRAGMENT_SHADER = `
#define MAX_COLORS 8
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform float uBaseHue;    // base hue (0-1)
uniform float uHueRange;   // hue range (0-1)
uniform float uSaturation; // saturation (0-1)
uniform float uOriginalMix; // 1 = original RGB rainbow, 0 = HSV rainbow, in-between = mix
varying vec2 vUv;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      vec2 s = q;

      for (int i = 0; i < MAX_COLORS; ++i) {
          if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-6.0 / exp(6.0 * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        // Compute both modes, then mix.
        vec2 s1 = q;
        vec2 s2 = q;
        vec3 originalCol = vec3(0.0);
        float intensity = 0.0;
        float rainbowPos = 0.0;
        
        for (int k = 0; k < 3; ++k) {
            s1 -= 0.01;
            s2 -= 0.01;
            vec2 r = sin(1.5 * (s1.yx * uFrequency) + 2.0 * cos(s1 * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s1) * kBelow;
            vec2 warped = s1 + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            float val = 1.0 - exp(-6.0 / exp(6.0 * m));
            
            originalCol[k] = val;
            intensity = max(intensity, val);
            rainbowPos += val * float(k) / 3.0;
        }
        
        float hue = fract(uBaseHue + (rainbowPos - 0.5) * 2.0 * uHueRange);
        float sat = uSaturation;
        vec3 hsvCol = hsv2rgb(vec3(hue, sat, 1.0)) * intensity;
        
        col = mix(hsvCol, originalCol, uOriginalMix);
        
        float originalAlpha = max(max(originalCol.r, originalCol.g), originalCol.b);
        float hsvAlpha = intensity;
        a = uTransparent > 0 ? mix(hsvAlpha, originalAlpha, uOriginalMix) : 1.0;
    }

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

function parseHexToVec3(hex: string): Vector3 | null {
  const value = hex.replace("#", "").trim();
  if (![3, 6].includes(value.length)) return null;

  const full =
    value.length === 3
      ? `${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`
      : value;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(n => Number.isNaN(n))) return null;
  return new Vector3(r / 255, g / 255, b / 255);
}

export function ShaderBackground({
  className = "",
  style,
  rotation = 45,
  speed = 0.2,
  colors = [],
  transparent = true,
  autoRotate = 0,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.1,
  baseHue = 0.5,
  hueRange = 0.15,
  saturation = 0.6,
  originalMix = 0,
  onReady
}: ShaderBackgroundProps) {
  const didCallReady = useRef(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const rafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);

  const pointerTargetRef = useRef(new Vector2(0, 0));
  const pointerRef = useRef(new Vector2(0, 0));
  const pointerLerpRateRef = useRef(8);

  const baseHueTargetRef = useRef(baseHue);
  const baseHueCurrentRef = useRef(baseHue);
  const saturationTargetRef = useRef(saturation);
  const saturationCurrentRef = useRef(saturation);
  const originalMixTargetRef = useRef(originalMix);
  const originalMixCurrentRef = useRef(originalMix);
  const colorLerpRateRef = useRef(3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new PlaneGeometry(2, 2);
    const colorArray = Array.from({ length: 8 }, () => new Vector3(0, 0, 0));

    const material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uCanvas: { value: new Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: { value: new Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: colorArray },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uBaseHue: { value: baseHue },
        uHueRange: { value: hueRange },
        uSaturation: { value: saturation },
        uOriginalMix: { value: originalMix }
      },
      premultipliedAlpha: true,
      transparent: true
    });

    materialRef.current = material;

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      alpha: true
    });
    rendererRef.current = renderer;

    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(new Color(0x000000), transparent ? 0 : 1);

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      material.uniforms.uCanvas.value.set(w, h);
    };

    resize();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resizeObserverRef.current = ro;
    } else {
      window.addEventListener("resize", resize);
    }

    const clock = new Clock();
    let didFirstFrame = true;

    const frame = () => {
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      if (didFirstFrame) {
        material.uniforms.uTime.value = 0;

        const r = ((rotationRef.current % 360) * Math.PI) / 180;
        material.uniforms.uRot.value.set(Math.cos(r), Math.sin(r));
        material.uniforms.uPointer.value.set(0, 0);

        material.uniforms.uBaseHue.value = baseHueCurrentRef.current;
        material.uniforms.uSaturation.value = saturationCurrentRef.current;
        material.uniforms.uOriginalMix.value = originalMixCurrentRef.current;

        renderer.render(scene, camera);
        didFirstFrame = false;

        if (onReady && !didCallReady.current) {
          didCallReady.current = true;
          onReady();
        }

        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      material.uniforms.uTime.value = elapsed;

      const rr = (((rotationRef.current % 360) + autoRotateRef.current * elapsed) * Math.PI) / 180;
      material.uniforms.uRot.value.set(Math.cos(rr), Math.sin(rr));

      const lerpPointer = Math.min(1, delta * pointerLerpRateRef.current);
      pointerRef.current.lerp(pointerTargetRef.current, lerpPointer);
      material.uniforms.uPointer.value.copy(pointerRef.current);

      const lerpColor = Math.min(1, delta * colorLerpRateRef.current);
      baseHueCurrentRef.current += (baseHueTargetRef.current - baseHueCurrentRef.current) * lerpColor;
      saturationCurrentRef.current += (saturationTargetRef.current - saturationCurrentRef.current) * lerpColor;
      originalMixCurrentRef.current += (originalMixTargetRef.current - originalMixCurrentRef.current) * lerpColor;

      material.uniforms.uBaseHue.value = baseHueCurrentRef.current;
      material.uniforms.uSaturation.value = saturationCurrentRef.current;
      material.uniforms.uOriginalMix.value = originalMixCurrentRef.current;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement);
      }
    };
    // Only run once; uniform updates are handled in separate effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
  }, [rotation, autoRotate]);

  useEffect(() => {
    const material = materialRef.current;
    const renderer = rendererRef.current;
    if (!material) return;

    material.uniforms.uSpeed.value = speed;
    material.uniforms.uScale.value = scale;
    material.uniforms.uFrequency.value = frequency;
    material.uniforms.uWarpStrength.value = warpStrength;
    material.uniforms.uMouseInfluence.value = mouseInfluence;
    material.uniforms.uParallax.value = parallax;
    material.uniforms.uNoise.value = noise;
    material.uniforms.uHueRange.value = hueRange;

    baseHueTargetRef.current = baseHue;
    saturationTargetRef.current = saturation;
    originalMixTargetRef.current = originalMix;

    const parsedColors = (colors || [])
      .filter(Boolean)
      .slice(0, 8)
      .map(c => parseHexToVec3(c))
      .filter((v): v is Vector3 => !!v);

    const uniformColors = material.uniforms.uColors.value as Vector3[];
    for (let i = 0; i < 8; i++) {
      const v = uniformColors[i];
      if (!v) continue;
      if (i < parsedColors.length) v.copy(parsedColors[i]);
      else v.set(0, 0, 0);
    }

    material.uniforms.uColorCount.value = parsedColors.length;
    material.uniforms.uTransparent.value = transparent ? 1 : 0;
    renderer?.setClearColor(new Color(0x000000), transparent ? 0 : 1);
  }, [
    autoRotate,
    baseHue,
    colors,
    frequency,
    hueRange,
    mouseInfluence,
    noise,
    originalMix,
    parallax,
    rotation,
    scale,
    saturation,
    speed,
    transparent,
    warpStrength
  ]);

  useEffect(() => {
    const onPointerMove = (ev: PointerEvent) => {
      const x = (ev.clientX / window.innerWidth) * 2 - 1;
      const y = -((ev.clientY / window.innerHeight) * 2 - 1);
      pointerTargetRef.current.set(x, y);
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return <div ref={containerRef} className={`w-full h-full relative overflow-hidden ${className}`} style={style} />;
}
