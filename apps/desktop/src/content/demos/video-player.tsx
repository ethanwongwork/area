/** Video player gallery specimens: one variant per tile. docs/specs/video-player.md. The clip is David Tee's avatar photo
 * with a slow zoom (8 s, recorded from a canvas), served beside the other sample images; the poster is the photo. */
import { Figure, VideoPlayer } from "@area/react";

const clip = { src: "images/sample-video.webm", poster: "images/david-tee.jpg", preload: "metadata" } as const;
const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };
/* Tiles past the first play: muted, looping, controls kept, so the controller shows at rest (and on the review page). */
const playing = { autoPlay: true, muted: true, loop: true, controls: "always" } as const;

/* Before the first play: the poster and the round play. */
export const GalleryVideoPlayer = () => <div style={width}><VideoPlayer label="Sample video" {...clip} /></div>;
/* Playing: QuickTime Player's floating controller. */
export const GalleryVideoPlayerFloating = () => <div style={width}><VideoPlayer label="Sample video" {...clip} {...playing} /></div>;
/* One row along the foot, on a fade. */
export const GalleryVideoPlayerBar = () => <div style={width}><VideoPlayer label="Sample video" layout="bar" {...clip} {...playing} /></div>;
/* One round play / pause, for ambient loops. */
export const GalleryVideoPlayerMinimal = () => <div style={width}><VideoPlayer label="Sample video" layout="minimal" {...clip} autoPlay muted loop /></div>;
/* In a Figure, with its caption. */
export const GalleryVideoPlayerFigure = () => (
  <div style={width}><Figure style={{ inlineSize: "100%" }} caption="Caption describing the video."><VideoPlayer label="Sample video" {...clip} {...playing} /></Figure></div>
);
/* A narrow player folds the floating controller into one pill. */
export const GalleryVideoPlayerNarrow = () => <div style={{ inlineSize: "calc(var(--area-space-96) * 3.5)" }}><VideoPlayer label="Sample video" {...clip} {...playing} /></div>;
