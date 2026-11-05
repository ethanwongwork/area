# The rules

## 01 · Real components only

A figure is Area's components and the app's demos, rendered. Never a redrawing. If a
component looks wrong in a figure, the specimen is wrong (use the demo) or page CSS is
leaking in.

## 02 · Area's paint

The abstraction changes words and nothing else. Edges, fills, corners, icons, shadows and
states come from Area's CSS under the figure's scope.

## 03 · The bar is the word

A bar is exactly one word's width and its ink's height, in its own colour, light, on every label (buttons, badges,
tags and chips included), so a sentence reads as words and wraps where they wrap. A number is its digits, each a
numeral-wide block; separators are space. A field's value or placeholder gets the same shapes, laid over it.

## 04 · One drawing at every size

A figure is drawn at Area's size and scaled as a whole, at the one scale its kind of frame
uses. Never scale one figure up to fill a frame.

## 05 · Real UI, one component per tile

Screens and vignettes are real compositions after product references. A gallery tile holds
one specimen of one family, centred on what it paints with wide margins; two, or a few close together, only when one
can't show it. A setting is shown on the screen that shows it best.

## 06 · True values

The setting's token is what changes between options, at its real value. To make it read,
choose the screen or vignette where it shows most, never a bigger value.

## 07 · Honest states

A hover, press, focus or lift uses the component's own hook or Area's own paint, held
still, with the pointer where it would be.

## 08 · No new words

Copy is the placeholder vocabulary. Real fidelity only where the text's colour is the
subject.

## 09 · One line, one ink

In Line, every stroke is 1px on screen and the muted ink, whatever the scale: edges, outlines, icons, words, notes. A
fill survives only as a control's light tone or a dot's ink. A sheet's dimensions are measured from the drawing.
