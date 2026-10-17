# History: how Aero, Aqua and iOS 6 distributed their materials (checked 2026-10-16/17)

Research agent report, condensed. * = inferred from period screenshots, not stated by a source.

## Treatment by control

| Control | Windows Aero | Mac OS X Aqua | iOS 6 |
| --- | --- | --- | --- |
| Frame, title bar, toolbar bar | strong (glass) | subtle–strong (grey gradient; metal on primary windows only) | strong (gradient + shadow) |
| Default / primary button | strong (blue, animated pulse) | strong (blue gel, pulse) | n/a |
| Other push buttons | subtle–moderate* | subtle ("clear" gel shape, no colour) | subtle* |
| Toolbar buttons | none at rest, affordance on hover | moderate (frame-only translucent) | moderate (bordered in nav bars) |
| Text field | none–subtle (border states only) | subtle* (inset bezel) | subtle (rounded field) |
| Combobox / popup | subtle | moderate–strong* | n/a |
| Checkbox / radio | subtle* | moderate* (gel when on) | n/a |
| Switch | n/a | n/a | strong* (gloss) |
| Slider thumb | subtle* | moderate* | moderate* |
| Progress | strong (green, moving overlay) | strong (blue pulsing) | moderate* |
| Tabs / segmented | subtle* | moderate* | moderate–strong* |
| List / tree selection | subtle (gradient on hover and selection) | subtle* (flat colour) | moderate* (blue gradient) |
| List / table content | none | none (white) | none |
| Menu | subtle (hot-item gradient) | subtle (slight translucency) | n/a |
| Tooltip | subtle* | none* | n/a |
| Popover / HUD | n/a | translucent, immersive apps only | n/a |
| Alert | n/a | n/a | strong* |
| Badge | n/a | n/a | strong* (red gloss) |

## Principles, with sources

1. **Chrome carries the material and content stays plain.**
   - Aero: glass on the frame only. "Don't use glass in situations where a plain window background would be more attractive or easier to use." (learn.microsoft.com, Win7 UX guide, "Window frames")
   - Aqua 2012 HIG: content views "display a white background by default".
2. **One hero per view.** Aqua: "All push buttons are clear except the default button, which uses the default color (in addition to pulsing)." (HIG 2004 and 2009, archived.) Aero likewise gives only the default button blue. The other strong carriers are status and motion: progress and the switch.
3. **Material belongs to its zone.** Aqua: toolbar controls "include a translucency" and must not be used in the window body. iOS 6: every nav-bar control gets "a bezel".
4. **Toolbars stay quiet at rest.** Aero: "On hover, display the button affordance."
5. **Inputs are recessed, never glossy.** Aero edit and combobox have only border states; Aqua and iOS used inset fields.
6. **Selection may get a gradient; rows never do.** Aero list and tree: the gradient is on hot and selected items only.
7. **Translucency is for small, image-led regions with little text.** Aero: "strategically in small regions … without text". Aqua: HUD panels small, "use color sparingly".
8. **Restraint moved further toward flat over time** (Lion, iOS 7, Windows 8). NN/g later found that weak signifiers cost about 22% more task time (2017). That argues for a residual bezel on interactive controls, not none.

Sources:
- learn.microsoft.com/en-us/windows/win32/uxguide/{win-window-frames, vis-graphic, cmd-toolbars, vis-color, progress-bars}
- learn.microsoft.com/en-us/windows/win32/controls/parts-and-states
- Apple HIG archives on web.archive.org (2004, 2009 and 2012 Mac; 2012 iOS; iOS 7 Transition Guide)
- daringfireball.net/2004/10/brushed_metal
- nngroup.com/articles/flat-design
- nngroup.com/articles/flat-ui-less-attention-cause-uncertainty
