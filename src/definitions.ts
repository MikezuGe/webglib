// Misc
export const N0 = 0;
export const N1 = 1;
export const N2 = 2;
export const N3 = 3;
export const N4 = 4;
export const { PI } = Math;
export const BYTE_BITS = 8;
export const ROTATION_HALF_DEG = 180;
export const ROTATION_FULL_DEG = 360;
export const ROTATION_HALF_RAD = 3.141592653589793;
export const ROTATION_FULL_RAD = 6.283185307179586;

// Data types

// Data types - Float 16
export const FLOAT16_BYTES = 2;
export const FLOAT16_MIN = -65504;
export const FLOAT16_MAX = 65504;

// Data types - Float 32
export const FLOAT32_BYTES = 4;
export const FLOAT32_MIN = -3.4028234663852886e38;
export const FLOAT32_MAX = 3.4028234663852886e38;

// Data types - Signed integer 8
export const SINT8_BYTES = 1;
export const SINT8_MIN = -128;
export const SINT8_MAX = 127;

// Data types - Signed integer 16
export const SINT16_BYTES = 2;
export const SINT16_MIN = -32768;
export const SINT16_MAX = 32767;

// Data types - Signed integer 32
export const SINT32_BYTES = 4;
export const SINT32_MIN = -2147483648;
export const SINT32_MAX = 2147483647;

// Data types - Unsigned integer 8
export const UINT8_BYTES = 1;
export const UINT8_MIN = 0;
export const UINT8_MAX = 255;

// Data types - Unsigned integer 16
export const UINT16_BYTES = 2;
export const UINT16_MIN = 0;
export const UINT16_MAX = 65535;

// Data types - Unsigned integer 32
export const UINT32_BYTES = 4;
export const UINT32_MIN = 0;
export const UINT32_MAX = 4294967295;

// Custom canvas
export const CANVAS_DEFAULT_TOP = 0;
export const CANVAS_DEFAULT_LEFT = 0;
export const CANVAS_DEFAULT_BACKGROUND_COLOR = "gray";

// Geometry
export const SQUARE_VERTICES = 6;

// Geometry - Cube
export const CUBE_DEFAULT_VERTICE_COUNT = 36;
export const CUBE_DEFAULT_VERTICE_COUNT_INDICED = 8;

// Geometry - Plane
export const PLANE_MIN_DIVISIONS = 1;
export const PLANE_DEFAULT_WIDTH = 1;
export const PLANE_DEFAULT_HEIGHT = 1;
export const PLANE_DEFAULT_DIVISIONS = 1;

// Vec3
export const VEC3_SIZE = 3;
export const VEC3_BYTES = 12;
export const V0 = 0;
export const V1 = 1;
export const V2 = 2;

// Mat4
export const MAT4_SIZE = 16;
export const MAT4_BYTES = 64;
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

// Quat
export const QUAT_SIZE = 4;
export const QUAT_BYTES = 16;
export const Q0 = 0;
export const Q1 = 1;
export const Q2 = 2;
export const Q3 = 3;

// Perspective camera
export const PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO = 1;
export const PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG = 60;
export const PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_RAD = 1.0471975511965976;
export const PERSPECTIVE_CAMERA_DEFAULT_NEAR = 0.1;
export const PERSPECTIVE_CAMERA_DEFAULT_FAR = 100;
export const PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_DEG = 180;
export const PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_RAD = 6.283185307179586;
export const PERSPECTIVE_CAMERA_MIN_ASPECT_RATIO = 0.1;
export const PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_DEG = 1;
export const PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_RAD = 0.017453292519943295;
export const PERSPECTIVE_CAMERA_MIN_NEAR = 0.1;
export const PERSPECTIVE_CAMERA_MIN_FAR = 0.1;

// Orthographic camera
export const ORTHOGRAPHIC_CAMERA_DEFAULT_LEFT = -5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_RIGHT = 5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_BOTTOM = -5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_TOP = 5;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_NEAR = 0.1;
export const ORTHOGRAPHIC_CAMERA_DEFAULT_FAR = 100;
