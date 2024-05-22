// Misc
export const { PI } = Math;
export const N0 = 0;
export const N1 = 1;
export const N2 = 2;
export const N3 = 3;
export const N4 = 4;
export const BYTE_BITS = 8;
export const FLOAT32_BYTES = Float32Array.BYTES_PER_ELEMENT;
export const FLOAT64_BYTES = Float64Array.BYTES_PER_ELEMENT;
export const UINT8_BYTES = Uint8Array.BYTES_PER_ELEMENT;
export const UINT16_BYTES = Uint16Array.BYTES_PER_ELEMENT;
export const UINT32_BYTES = Uint32Array.BYTES_PER_ELEMENT;
export const ROTATION_FULL_DEG = 360;
export const ROTATION_FULL_RAD = N2 * PI;

// Custom canvas
export const CANVAS_DEFAULT_TOP = 0;
export const CANVAS_DEFAULT_LEFT = 0;

// Geometry
export const SQUARE_VERTICES = 6;

// Geometry - Cube
export const CUBE_FACES = 6;
export const CUBE_VERTICES_PER_SIDE = 6;
export const CUBE_UNIQUE_VERTICES_INDICED = 8;
export const CUBE_UNIQUE_VERTICES = 24;
export const CUBE_DEFAULT_VERTICES = 36;
export const CUBE_DEFAULT_VERTICES_INDICED = 8;
export const CUBE_DEFAULT_STRIDE = 3;

// Geometry - Plane
export const PLANE_MIN_DIVISIONS = 1;
export const PLANE_DEFAULT_WIDTH = 1;
export const PLANE_DEFAULT_HEIGHT = 1;
export const PLANE_DEFAULT_DIVISIONS = 1;
export const PLANE_DEFAULT_VERTICES = 4;
export const PLANE_DEFAULT_INDICES = 6;
export const PLANE_DEFAULT_STRIDE = 3;

// Mat4
export const MAT4_SIZE = 16;
export const MAT4_BYTES = MAT4_SIZE * FLOAT32_BYTES;
export const M00 = 0;
export const M01 = 1;
export const M02 = 2;
export const M03 = 3;
export const M10 = 4;
export const M11 = 5;
export const M12 = 6;
export const M13 = 7;
export const M20 = 8;
export const M21 = 9;
export const M22 = 10;
export const M23 = 11;
export const M30 = 12;
export const M31 = 13;
export const M32 = 14;
export const M33 = 15;

// Perspective camera
export const PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO = 1;
export const PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG = 60;
export const PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_RAD = 1.0471975511965976;
export const PERSPECTIVE_CAMERA_DEFAULT_NEAR = 0.1;
export const PERSPECTIVE_CAMERA_DEFAULT_FAR = 100;

// Orthographic camera
export const ORTHOGRAPHIC_CAMERA_DEFAULT_LEFT = -5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_RIGHT = 5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_BOTTOM = -5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_TOP = 5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_NEAR = 0.1;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_FAR = 100;
