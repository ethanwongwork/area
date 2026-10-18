// Video player: a native video with Area's own controls over it (docs/specs/video-player.md; survey
// docs/research/video-player-2026-10-17.md). Play, the scrubber, the time, mute with its volume, then captions, picture in
// picture and full screen when the video and the browser offer them; a round play before the first play. The controls
// hide 2 s after the last movement while playing, never while paused or while focus is inside.
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode, VideoHTMLAttributes } from "react";
import { videoPlayerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { assignRef } from "./overlay.ts";

type VideoPlayerVariants = VariantProps<typeof MANIFESTS.videoPlayer>;

export interface VideoPlayerProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, "controls"> {
  /** Names the player for assistive tech: the video's title. */
  label: string;
  /** `auto` (default): the controls hide while the video plays and nothing moves. `always`: they stay. */
  controls?: VideoPlayerVariants["controls"];
  /** Caption and subtitle tracks (`<track>` elements). */
  children?: ReactNode;
  /** Props for the outer element (the group that holds the video and its controls). */
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
}

/* spec: idle hide after 2000 ms while playing (Plyr, Video.js, Vidstack, Media Chrome). */
const IDLE = 2000;

const clock = (seconds: number) => {
  if (!Number.isFinite(seconds)) seconds = 0;
  const s = Math.floor(seconds % 60), m = Math.floor(seconds / 60) % 60, h = Math.floor(seconds / 3600);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
};
const spoken = (seconds: number) => {
  const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
  return [m ? `${m} minute${m === 1 ? "" : "s"}` : "", `${s} second${s === 1 ? "" : "s"}`].filter(Boolean).join(" ");
};

export const VideoPlayer = /* @__PURE__ */ forwardRef<HTMLVideoElement, VideoPlayerProps>(function VideoPlayer(
  { label, controls, className, children, rootProps, style, ...video },
  ref,
) {
  const root = useRef<HTMLDivElement | null>(null);
  const media = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(Boolean(video.autoPlay));
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(Boolean(video.muted));
  const [captions, setCaptions] = useState(false);
  const [hasTracks, setHasTracks] = useState(false);
  const [pip, setPip] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  // The volume slider opens with a mouse over mute (YouTube); touch and keyboard reach it by focus.
  const [volumeOpen, setVolumeOpen] = useState(false);
  // Read after mount, so the server's markup and the first client render agree.
  const [pipSupported, setPipSupported] = useState(false);
  useEffect(() => setPipSupported(Boolean(document.pictureInPictureEnabled)), []);
  const timer = useRef(0);

  // Idle: hide the controls after 2 s without movement while playing; never while paused or while focus is inside.
  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const node = root.current, el = media.current;
      if (!node || !el || el.paused || node.contains(document.activeElement) && document.activeElement !== node) return;
      setIdle(true);
    }, IDLE);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    const el = media.current;
    if (!el) return;
    const sync = () => {
      setPlaying(!el.paused);
      setTime(el.currentTime);
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
      setVolume(el.volume);
      setMuted(el.muted);
      const end = el.buffered.length ? el.buffered.end(el.buffered.length - 1) : 0;
      setLoaded(el.duration ? end / el.duration : 0);
      setHasTracks(el.textTracks.length > 0);
      setCaptions([...el.textTracks].some(track => track.mode === "showing"));
    };
    const events = ["play", "pause", "timeupdate", "durationchange", "loadedmetadata", "volumechange", "progress", "ended"];
    events.forEach(name => el.addEventListener(name, sync));
    // A recording (MediaRecorder, a screen capture) may carry no duration: seek far past the end once so the browser
    // finds it, then return to the start.
    let probing = false;
    const probe = () => {
      if (el.duration !== Infinity || probing) return;
      probing = true;
      const done = () => { el.removeEventListener("durationchange", done); if (Number.isFinite(el.duration)) { el.currentTime = 0; probing = false; sync(); } };
      el.addEventListener("durationchange", done);
      el.currentTime = Number.MAX_SAFE_INTEGER;
    };
    el.addEventListener("loadedmetadata", probe);
    const onPlay = () => { setStarted(true); wake(); };
    const onPause = () => { setIdle(false); window.clearTimeout(timer.current); };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    const onPip = () => setPip(document.pictureInPictureElement === el);
    el.addEventListener("enterpictureinpicture", onPip);
    el.addEventListener("leavepictureinpicture", onPip);
    const onFullscreen = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    sync();
    if (el.readyState >= 1) probe();
    return () => {
      events.forEach(name => el.removeEventListener(name, sync));
      el.removeEventListener("loadedmetadata", probe);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("enterpictureinpicture", onPip);
      el.removeEventListener("leavepictureinpicture", onPip);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [wake]);

  const el = () => media.current;
  const toggle = () => { const v = el(); if (!v) return; if (v.paused) void v.play().catch(() => {}); else v.pause(); };
  const seek = (to: number) => { const v = el(); if (v && Number.isFinite(v.duration)) v.currentTime = Math.min(Math.max(0, to), v.duration); };
  const setLevel = (to: number) => { const v = el(); if (!v) return; v.volume = Math.min(Math.max(0, to), 1); v.muted = v.volume === 0; };
  const toggleMute = () => { const v = el(); if (v) v.muted = !v.muted; };
  const toggleCaptions = () => {
    const v = el(); if (!v || !v.textTracks.length) return;
    const on = ![...v.textTracks].some(track => track.mode === "showing");
    [...v.textTracks].forEach((track, index) => { track.mode = on && index === 0 ? "showing" : "disabled"; });
    setCaptions(on);
  };
  const togglePip = () => { const v = el(); if (!v) return; if (document.pictureInPictureElement) void document.exitPictureInPicture(); else void v.requestPictureInPicture?.().catch(() => {}); };
  const toggleFullscreen = () => { const node = root.current; if (!node) return; if (document.fullscreenElement) void document.exitFullscreen(); else void node.requestFullscreen?.().catch(() => {}); };

  // Keyboard (YouTube, Vidstack, Plyr): Space / K play, ← → 5 s, J / L 10 s, ↑ ↓ volume 5%, M mute, F full screen,
  // C captions, I picture in picture, 0–9 a tenth of the way, Home / End. Keys a focused range or button handles stay its own.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    wake();
    const v = el(); if (!v || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    const onRange = target.matches("input[type=range]"), onButton = target.matches("button");
    const key = event.key.toLowerCase();
    const run = (fn: () => void) => { event.preventDefault(); fn(); };
    if (key === "k" || (key === " " && !onButton)) return run(toggle);
    if (onRange) return;
    if (key === "arrowleft") return run(() => seek(v.currentTime - 5));
    if (key === "arrowright") return run(() => seek(v.currentTime + 5));
    if (key === "j") return run(() => seek(v.currentTime - 10));
    if (key === "l") return run(() => seek(v.currentTime + 10));
    if (key === "arrowup") return run(() => setLevel(v.volume + 0.05));
    if (key === "arrowdown") return run(() => setLevel(v.volume - 0.05));
    if (key === "m") return run(toggleMute);
    if (key === "f") return run(toggleFullscreen);
    if (key === "c") return run(toggleCaptions);
    if (key === "i" && pipSupported) return run(togglePip);
    if (key === "home") return run(() => seek(0));
    if (key === "end") return run(() => seek(v.duration));
    if (/^[0-9]$/.test(key)) return run(() => seek(v.duration * Number(key) / 10));
  };

  const played = duration ? (time / duration) * 100 : 0;
  const rangeStyle = (fill: number, buffer = 0) => ({ "--_played": `${fill}%`, "--_loaded": `${buffer * 100}%` }) as CSSProperties;
  const level = muted ? 0 : volume;

  return (
    <div {...rootProps} ref={root} role="group" aria-label={label} tabIndex={0}
      className={videoPlayerVariants({ controls }, rootProps?.className)}
      data-started={started ? "" : undefined} data-idle={idle && playing ? "" : undefined}
      onPointerMove={wake} onPointerDown={wake} onFocus={wake} onKeyDown={onKeyDown}>
      <video {...video} ref={node => { media.current = node; assignRef(ref, node); }} className={[videoPlayerVariants.element("media"), className].filter(Boolean).join(" ")}
        style={style} playsInline onClick={toggle} onDoubleClick={toggleFullscreen}>
        {children}
      </video>
      {started ? null : (
        <button type="button" className={videoPlayerVariants.element("start")} aria-label="Play" onClick={toggle}>
          <Glyph name="play" size={20} />
        </button>
      )}
      <div className={videoPlayerVariants.element("scrim")} aria-hidden="true" />
      {started ? <div className={videoPlayerVariants.element("controls")}>
        <button type="button" className={videoPlayerVariants.element("button")} aria-label={playing ? "Pause" : "Play"} onClick={toggle}>
          <Glyph name={playing ? "pause" : "play"} />
        </button>
        <input type="range" className={videoPlayerVariants.element("range")} aria-label="Seek"
          min={0} max={duration || 0} step="any" value={time} style={rangeStyle(played, loaded)}
          aria-valuetext={`${spoken(time)} of ${spoken(duration)}`}
          onChange={event => seek(Number(event.currentTarget.value))} />
        <span className={videoPlayerVariants.element("time")}>
          {clock(time)}<span className={videoPlayerVariants.element("duration")}> / {clock(duration)}</span>
        </span>
        <div className={videoPlayerVariants.element("volume")} data-open={volumeOpen ? "" : undefined}
          onPointerEnter={event => { if (event.pointerType === "mouse") setVolumeOpen(true); }} onPointerLeave={() => setVolumeOpen(false)}>
          <button type="button" className={videoPlayerVariants.element("button")} aria-label={muted || volume === 0 ? "Unmute" : "Mute"} onClick={toggleMute}>
            <Glyph name={muted || volume === 0 ? "volume-off" : "volume"} />
          </button>
          <input type="range" className={videoPlayerVariants.element("range")} aria-label="Volume"
            min={0} max={1} step={0.05} value={level} style={rangeStyle(level * 100)}
            aria-valuetext={`${Math.round(level * 100)}% volume`}
            onChange={event => setLevel(Number(event.currentTarget.value))} />
        </div>
        {hasTracks ? (
          <button type="button" className={videoPlayerVariants.element("button")} aria-label="Captions" aria-pressed={captions} onClick={toggleCaptions}>
            <Glyph name="captions" />
          </button>
        ) : null}
        {pipSupported ? (
          <button type="button" className={videoPlayerVariants.element("button")} data-control="pip" aria-label={pip ? "Exit picture in picture" : "Picture in picture"} onClick={togglePip}>
            <Glyph name="picture-in-picture" />
          </button>
        ) : null}
        <button type="button" className={videoPlayerVariants.element("button")} aria-label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
          <Glyph name={fullscreen ? "minimize" : "maximize"} />
        </button>
      </div> : null}
    </div>
  );
});

export { videoPlayerVariants };
