const zero = 0.0;
const one = 1.0;

import { Geometry } from "./types";

export class Cube extends Geometry {
  // 3D cube vertices
  // x y z r g b nx ny nz
  // prettier-ignore
  public readonly vertices = new Float32Array([
    // front
    -one, one, -one, one, zero, zero, zero, zero, -one,
    -one, -one, -one, one, zero, zero, zero, zero, -one,
    one, -one, -one, one, zero, zero, zero, zero, -one,
    -one, one, -one, one, zero, zero, zero, zero, -one,
    one, -one, -one, one, zero, zero, zero, zero, -one,
    one, one, -one, one, zero, zero, zero, zero, -one,
    // right
    one, one, -one, zero, one, zero, one, zero, zero,
    one, -one, -one, zero, one, zero, one, zero, zero,
    one, -one, one, zero, one, zero, one, zero, zero,
    one, one, -one, zero, one, zero, one, zero, zero,
    one, -one, one, zero, one, zero, one, zero, zero,
    one, one, one, zero, one, zero, one, zero, zero,
    // back
    one, one, one, zero, zero, one, zero, zero, one,
    one, -one, one, zero, zero, one, zero, zero, one,
    -one, -one, one, zero, zero, one, zero, zero, one,
    one, one, one, zero, zero, one, zero, zero, one,
    -one, -one, one, zero, zero, one, zero, zero, one,
    -one, one, one, zero, zero, one, zero, zero, one,
    // left
    -one, one, one, one, one, zero, -one, zero, zero,
    -one, -one, one, one, one, zero, -one, zero, zero,
    -one, -one, -one, one, one, zero, -one, zero, zero,
    -one, one, one, one, one, zero, -one, zero, zero,
    -one, -one, -one, one, one, zero, -one, zero, zero,
    -one, one, -one, one, one, zero, -one, zero, zero,
    // top
    -one, one, one, zero, one, one, zero, one, zero,
    -one, one, -one, zero, one, one, zero, one, zero,
    one, one, -one, zero, one, one, zero, one, zero,
    -one, one, one, zero, one, one, zero, one, zero,
    one, one, -one, zero, one, one, zero, one, zero,
    one, one, one, zero, one, one, zero, one, zero,
    // bottom
    -one, -one, -one, one, zero, one, zero, -one, zero,
    -one, -one, one, one, zero, one, zero, -one, zero,
    one, -one, one, one, zero, one, zero, -one, zero,
    -one, -one, -one, one, zero, one, zero, -one, zero,
    one, -one, one, one, zero, one, zero, -one, zero,
    one, -one, -one, one, zero, one, zero, -one, zero,
  ]);
}
