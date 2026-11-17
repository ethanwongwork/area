// Frame-exact exports, run inside a piece's page by scripts/export-set.mjs. Every frame is drawn
// at its own moment by the piece's render(t, size) and encoded in order, so a loop closes
// exactly and nothing depends on how fast the machine is.
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

const save = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 4000);
};

/** The piece at `t`, `size` px square; with `zoom` and `focus` a crop of it drawn larger. */
export function frame(t, size, { zoom = 1, focus = [0.5, 0.5] } = {}) {
  const ex = window.__export;
  if (zoom <= 1) return ex.render(t, size);
  const big = ex.render(t, Math.round(size * zoom));
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d', { colorSpace: 'display-p3' });
  const B = big.width, s = size;
  const x = Math.min(B - s, Math.max(0, focus[0] * B - s / 2)), y = Math.min(B - s, Math.max(0, focus[1] * B - s / 2));
  g.drawImage(big, x, y, s, s, 0, 0, s, s);
  return c;
}

const blobOf = (canvas, type = 'image/png', q) =>
  canvas.convertToBlob ? canvas.convertToBlob({ type, quality: q }) : new Promise((r) => canvas.toBlob(r, type, q));

/** Saves a PNG of the piece at `t`, and a JPEG of it at `thumb` px for the views gallery. */
export async function still({ t = 0, size = 2160, name, thumb = 0, thumbName, zoom, focus }) {
  const c = frame(t, size, { zoom, focus });
  save(await (name.endsWith('.jpg') ? blobOf(c, 'image/jpeg', 0.9) : blobOf(c)), name);
  if (thumb) {
    const s = document.createElement('canvas');
    s.width = s.height = thumb;
    s.getContext('2d').drawImage(c, 0, 0, thumb, thumb);
    save(await blobOf(s, 'image/jpeg', 0.88), thumbName);
  }
}

/** How far the loop's end is from its start: mean difference per channel, 0–255. */
export function loopGap(size = 360) {
  const ex = window.__export;
  if (!ex.loop) return 0;
  const read = (t) => {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(ex.render(t, size), 0, 0);
    return g.getImageData(0, 0, size, size).data;
  };
  const a = read(0), b = read(ex.loop);
  let d = 0;
  for (let i = 0; i < a.length; i += 4) d += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
  return d / ((a.length / 4) * 3);
}

/**
 * Saves an MP4 (H.264, high profile) of `loops` whole loops at `size` px and `fps`, drawn
 * frame by frame. The last frame is one frame short of the loop, so played on repeat it
 * runs on without a stutter.
 */
export async function video({ size = 1080, fps, loops = 1, seconds, bitrate, name, zoom, focus }) {
  const ex = window.__export;
  fps ??= ex.fps;
  const total = seconds ?? ex.loop * loops;
  const n = Math.round(total * fps);
  const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: 'avc', width: size, height: size, frameRate: fps }, fastStart: 'in-memory' });
  let failed = null;
  const enc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => (failed = e) });
  enc.configure({ codec: size > 1920 ? 'avc1.640033' : 'avc1.640032', width: size, height: size, bitrate: bitrate ?? (size > 1920 ? 60e6 : 20e6), framerate: fps, latencyMode: 'quality', avc: { format: 'avc' } });
  for (let i = 0; i < n; i++) {
    const c = frame(i / fps, size, { zoom, focus });
    const vf = new VideoFrame(c, { timestamp: Math.round((i * 1e6) / fps), duration: Math.round(1e6 / fps) });
    enc.encode(vf, { keyFrame: i % (fps * 2) === 0 });
    vf.close();
    if (enc.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 0));
    if (failed) throw failed;
  }
  await enc.flush();
  muxer.finalize();
  save(new Blob([muxer.target.buffer], { type: 'video/mp4' }), name);
  return { frames: n, seconds: n / fps };
}
