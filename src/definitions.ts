// Misc
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const FOUR = 4;
export const BYTE_BITS = 8;
export const FLOAT_BYTES = 4;
export const UINT_BYTES = 4;
export const { PI } = Math;

// Custom canvas
export const CANVAS_DEFAULT_TOP = 0;
export const CANVAS_DEFAULT_LEFT = 0;

// Geometry - Cube
export const CUBE_FACES = 6;
export const CUBE_VERTICES_PER_SIDE = 6;
export const CUBE_VERTICES = 36;
export const CUBE_INDICED_VERTICES = 8;

// Geometry - Plane
export const SQUARE_VERTICES = 6;
export const PLANE_MIN_DIVISIONS = 1;

// Mat4
export const MAT4_SIZE = 16;
export const MAT4_BYTES = MAT4_SIZE * FLOAT_BYTES;

// Camera
export const PROJECTION_DIRTY = 0b0001;

// Transform
export const ORIGIN_DIRTY = 0b0001;
export const ROTATION_DIRTY = 0b0010;
export const POSITION_DIRTY = 0b0100;
export const SCALE_DIRTY = 0b1000;
