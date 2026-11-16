precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uWarp;
uniform float uScale;
uniform float uGrain;
uniform vec3 uColors[4];
varying vec2 vUv;

// Simplex noise 3D, Ashima Arts / Stefan Gustavson (MIT).
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * snoise(p); p *= 2.02; a *= 0.5; }
  return v;
}

// Mix the four colours along t in [0, 1], with soft shoulders.
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = mix(uColors[0], uColors[1], smoothstep(0.0, 0.38, t));
  c = mix(c, uColors[2], smoothstep(0.32, 0.68, t));
  c = mix(c, uColors[3], smoothstep(0.66, 1.0, t));
  return c;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * uScale;
  vec2 m = (uPointer - 0.5) * vec2(aspect, 1.0) * uScale;

  // The pointer pulls the field toward itself.
  float d = length(p - m);
  p += (m - p) * 0.35 * exp(-d * d * 2.0);

  float t = uTime;
  vec2 q = vec2(fbm(vec3(p, t)), fbm(vec3(p + 5.2, t * 0.9)));
  vec2 r = vec2(fbm(vec3(p + uWarp * q + vec2(1.7, 9.2), t * 1.1)), fbm(vec3(p + uWarp * q + vec2(8.3, 2.8), t * 0.8)));
  float f = fbm(vec3(p + uWarp * r, t * 0.5));

  float v = 0.5 + 0.9 * f + 0.15 * r.y;
  vec3 col = ramp(v);

  // Film grain, stronger in the darks.
  float g = hash(gl_FragCoord.xy + fract(uTime * 37.0) * 100.0) - 0.5;
  col += g * uGrain * (1.2 - dot(col, vec3(0.299, 0.587, 0.114)));

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
