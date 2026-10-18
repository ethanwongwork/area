/** Video player gallery specimens: one variant per tile. docs/specs/video-player.md. The clip is David Tee's avatar photo
 * with a slow zoom (8 s, recorded from a canvas), served beside the other sample images; the poster is the photo.
 * Tiles past the first play start muted and looping with their controls kept, so the controller shows at rest. */
import { Figure, VideoPlayer } from "@area/react";

const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

/* Before the first play: the poster and the round play. */
export const GalleryVideoPlayer = () => (
  <div style={width}><VideoPlayer label="Sample video" src="images/sample-video.webm" poster="images/david-tee.jpg" preload="metadata" /></div>
);
/* Playing: QuickTime Player's floating controller. */
export const GalleryVideoPlayerFloating = () => (
  <div style={width}><VideoPlayer label="Sample video" src="images/sample-video.webm" poster="images/david-tee.jpg" autoPlay muted loop controls="always" /></div>
);
/* One row along the foot, on a fade. */
export const GalleryVideoPlayerBar = () => (
  <div style={width}><VideoPlayer label="Sample video" layout="bar" src="images/sample-video.webm" poster="images/david-tee.jpg" autoPlay muted loop controls="always" /></div>
);
/* One round play / pause, for ambient loops. */
export const GalleryVideoPlayerMinimal = () => (
  <div style={width}><VideoPlayer label="Sample video" layout="minimal" src="images/sample-video.webm" poster="images/david-tee.jpg" autoPlay muted loop /></div>
);
/* In a Figure, with its caption; the Figure takes the width. */
export const GalleryVideoPlayerFigure = () => (
  <div style={width}>
    <Figure style={{ inlineSize: "100%" }} caption="Caption describing the video.">
      <VideoPlayer label="Sample video" src="images/sample-video.webm" poster="images/david-tee.jpg" autoPlay muted loop controls="always" />
    </Figure>
  </div>
);
/* A narrow player folds the floating controller into one pill. */
export const GalleryVideoPlayerNarrow = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 3.5)" }}><VideoPlayer label="Sample video" src="images/sample-video.webm" poster="images/david-tee.jpg" autoPlay muted loop controls="always" /></div>
);
