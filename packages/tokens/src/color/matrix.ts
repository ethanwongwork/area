/**
 * Minimal 3x3 linear algebra, plus derivation of an RGB<->XYZ matrix from
 * chromaticity primaries.
 *
 * Every matrix in the colour pipeline is either an authoritative published
 * constant or derived here. Nothing is transcribed twice, so a forward matrix and
 * its inverse can never drift apart -- which is what guarantees exact round-trips.
 */

export type Vec3 = [number, number, number];
export type Matrix3 = readonly [Vec3, Vec3, Vec3];

export function multiplyMatrixVector(m: Matrix3, v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

export function multiplyMatrix(a: Matrix3, b: Matrix3): Matrix3 {
  const out: number[][] = [];
  for (let i = 0; i < 3; i++) {
    const row: number[] = [];
    for (let j = 0; j < 3; j++) {
      row.push(a[i]![0]! * b[0]![j]! + a[i]![1]! * b[1]![j]! + a[i]![2]! * b[2]![j]!);
    }
    out.push(row);
  }
  return out as unknown as Matrix3;
}

export function determinant(m: Matrix3): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

export function invert(m: Matrix3): Matrix3 {
  const det = determinant(m);
  if (Math.abs(det) < 1e-12) throw new Error("invert: matrix is singular");
  const d = 1 / det;
  return [
    [
      (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * d,
      (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * d,
      (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * d,
    ],
    [
      (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * d,
      (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * d,
      (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * d,
    ],
    [
      (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * d,
      (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * d,
      (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * d,
    ],
  ];
}

/** A CIE xy chromaticity coordinate. */
export interface Chromaticity {
  x: number;
  y: number;
}

/** xyY with Y=1 -> XYZ. */
function xyToXyz({ x, y }: Chromaticity): Vec3 {
  return [x / y, 1, (1 - x - y) / y];
}

/**
 * Derive the linear-RGB -> XYZ matrix from chromaticity primaries and a white point,
 * per the standard SMPTE RP 177 construction. Computing this rather than transcribing
 * it removes an entire class of copy error, and makes adding a gamut a two-line change.
 */
export function rgbToXyzMatrix(
  red: Chromaticity,
  green: Chromaticity,
  blue: Chromaticity,
  white: Chromaticity,
): Matrix3 {
  const r = xyToXyz(red);
  const g = xyToXyz(green);
  const b = xyToXyz(blue);
  const w = xyToXyz(white);

  const primaries: Matrix3 = [
    [r[0], g[0], b[0]],
    [r[1], g[1], b[1]],
    [r[2], g[2], b[2]],
  ];
  const scale = multiplyMatrixVector(invert(primaries), w);

  return [
    [r[0] * scale[0], g[0] * scale[1], b[0] * scale[2]],
    [r[1] * scale[0], g[1] * scale[1], b[1] * scale[2]],
    [r[2] * scale[0], g[2] * scale[1], b[2] * scale[2]],
  ];
}

/** CIE standard illuminant D65, as used by CSS Color 4 for sRGB and Display P3. */
export const D65: Chromaticity = { x: 0.3127, y: 0.329 };
