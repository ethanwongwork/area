#!/usr/bin/env python3
"""Analytical examples only: no browser capture or Area rendering claim."""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

def lum(c):
    return sum(w * (v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4)
               for w, v in zip((.2126, .7152, .0722), c))

def ratio(a, b):
    x, y = sorted((lum(a), lum(b)))
    return (y + .05) / (x + .05)

def gray(byte):
    return (byte / 255,) * 3

def over(src, alpha, bg):
    return tuple(alpha * a + (1-alpha) * b for a, b in zip(src, bg))

# Authored synthetic source-over example, encoded sRGB, opaque foreground.
fg = gray(118)
alpha = .01
interior = tuple((c-alpha)/(1-alpha) for c in fg)
endpoint_black = ratio(fg, over((1,1,1), alpha, (0,0,0)))
endpoint_white = ratio(fg, over((1,1,1), alpha, (1,1,1)))
interior_ratio = ratio(fg, over((1,1,1), alpha, interior))
assert endpoint_black >= 4.5 and endpoint_white >= 4.5
assert abs(interior_ratio - 1) < 1e-12
assert abs(ratio((0,0,0),(1,1,1)) - 21) < 1e-12
assert ratio(gray(224), gray(224)) == 1

results = {
    'status': 'analytical research examples; not screenshots or conformance results',
    'model': 'normal source-over in encoded sRGB, opaque final backing; WCAG relative luminance applied after composition',
    'sources': {
        'composition': 'https://www.w3.org/TR/compositing-1/#simplealphacompositing',
        'area_formula': 'https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/color/contrast.ts#L25-L40',
        'neumorphism_defaults': 'https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L11-L23',
        'neumorphism_generation': 'https://github.com/adamgiebl/neumorphism/blob/8ab93a6bea6493cc464d45a334b5fb7a90d34308/src/Configuration.js#L89-L104',
    },
    'endpoint_counterexample': {
        'provenance': 'authored synthetic inputs, not a proposed preset',
        'foreground': '#767676', 'tint': '#ffffff', 'tint_alpha': alpha,
        'on_black_backdrop': endpoint_black, 'on_white_backdrop': endpoint_white,
        'interior_backdrop_srgb': interior, 'on_interior_backdrop': interior_ratio,
    },
    'neumorphism_source_palette': {
        'provenance': 'task 06 R08 source preset; analytical palette bounds only',
        'body_backdrop': '#e0e0e0', 'dark_lobe': '#bebebe', 'light_lobe': '#ffffff',
        'body_backdrop_ratio': ratio(gray(224), gray(224)),
        'dark_lobe_body_ratio': ratio(gray(190), gray(224)),
        'light_lobe_body_ratio': ratio(gray(255), gray(224)),
        'whole_palette_extreme_ratio': ratio(gray(190), gray(255)),
    },
}
assert results['neumorphism_source_palette']['whole_palette_extreme_ratio'] < 3
out = json.dumps(results, indent=2) + '\n'
path = HERE / 'experiments.json'
if '--check' in sys.argv:
    assert path.read_text() == out, 'experiments.json stale; run experiments.py'
else:
    path.write_text(out)
print(json.dumps({k:v for k,v in results.items() if k not in ('sources',)}, indent=2))
