# Cloud shape options: three humps (2026-10-10)

Owner note on the four-lobe cloud: "not sure its better … maybe can explore 3 humps but just make the
middle one bigger or make the surface area bigger overall". Sheet: `2-cloud-shape-options.png`.
The candidates are in `apps/docs/assets/area-icons-pilot/explore/cloud-shape-{a..e}.svg` (group `cloud-shape`).
All are single closed bodies built with `icon-geometry.mjs lobes <foot> "cx,cy,r …"`, side lobes tangent
to the flat foot, and side and top extremes on the 0.5 grid. Every candidate passes the `--only` lint.

The square-keyline cloud icons cap the body at 12 wide (centre-line 2–14, ink 13.125 against 13.25). The
old cloud already reaches that width, so the extra area can only come from height and from fuller humps.
The plain cloud's horizontal keyline caps the height at 10 (ink 11.25).

| Row | Lobes (foot; cx,cy,r) | W × H (centre-line) | Area vs old | Sync 0.875 fill | Upload arrow fill | Largest disc |
|---|---|---|---|---|---|---|
| Old three-hump | 12.5; 4.5,10,2.5 · 7.5,7,3.5 · 11,9.5,3 | 12 × 9 | 100% | 1.07 w | 1.32 w | 6.68 |
| Current four-lobe | (path) | 12 × 8.5 | 95% | 0.95 w | 1.26 w | 6.43 |
| A · bigger middle, same footprint | 12.5; 4.5,10,2.5 · 7.75,7.5,4 · 11.25,9.75,2.75 | 12 × 9 | 102% | 1.17 w | 1.38 w | 7.61 |
| B · old grown | 13; 5,10,3 · 7.5,6.5,4 · 10.5,9.5,3.5 | 12 × 10.5 | 120% | 1.62 w | 1.79 w | 7.83 |
| C · symmetric, big middle | 13; 5,10,3 · 8,7,4 · 11,10,3 | 12 × 10 | 113% | 1.42 w | 1.77 w | 7.62 |
| **D · big middle left, right higher** | 13; 4.5,10.5,2.5 · 7.25,7.25,4.25 · 10.75,9.75,3.25 | 12 × 10 | 116% | 1.56 w | 1.78 w | 7.78 |
| E · old proportions, largest for every keyline | 13; 5,10,3 · 7.5,7,4 · 10.5,9.5,3.5 | 12 × 10 | 115% | 1.53 w | 1.78 w | 8.18 |

- **Area** is the enclosed centre-line area.
- **Fill** is the least solid left between the inset knockout and the filled body's edge, in line weights
  at 1.125 (the `clearance.mjs` measure; 1 w or more is clear). The sync column uses cloud-sync's filled
  0.875-scale sync mark at its best 1/16 position. The arrow column uses cloud-upload's inset arrow (stem 5,
  wings 2.5) at its best position, with x on the 0.5 grid.
- **Largest disc** is the lint's counter, the largest disc that fits inside the body.

The current four-lobe leaves the sync mark under 1 w (0.95). Every three-hump option clears both marks.

B (10.5 tall, ink 11.63) fits only the square keyline. The plain cloud would have to leave the horizontal
keyline, so B is shown only to set the ceiling. A keeps the old footprint and gains little (102%). At 16px
its left hump nearly merges into the middle. C and E read as domes: C's equal shoulders are low beside the
big middle, and E's right hump is a soft shoulder.

## Recommendation: D

D has three distinct humps at every size: a small left lobe, a large middle (r 4.25, left of centre) and
a right lobe set a little higher. It has 116% of the old area, the most of any option that fits both the
horizontal and square keylines. It leaves 1.56 w around the sync mark and 1.78 w around the upload arrow.
The middle hump is the bigger one the owner asked for, and the uneven sides keep the old cloud's
character rather than Fluent's symmetric dome.

If adopted, the cloud is 10 tall, with its foot at 13 in the plain cloud. cloud-sync, -rain, -snow and
-lightning currently set the body's foot at 11 (top 2). With D their foot moves to 12 so the top stays at
2. The outline sync arrows and the rain, snow and bolt parts below the foot then need re-placing.
