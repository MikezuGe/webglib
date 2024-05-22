import { vec3n } from "wgpu-matrix";
import type { Vec3n } from "wgpu-matrix";

const temp1Vec3 = vec3n.create();
const temp2Vec3 = vec3n.create();
const temp3Vec3 = vec3n.create();

export const calculateSurfaceNormal = (
  v1: Vec3n,
  v2: Vec3n,
  v3: Vec3n,
  dst: Vec3n
  // eslint-disable-next-line @typescript-eslint/max-params
): void => {
  vec3n.subtract(v2, v1, temp1Vec3);
  vec3n.subtract(v3, v1, temp2Vec3);
  vec3n.cross(temp1Vec3, temp2Vec3, temp3Vec3);
  vec3n.normalize(temp3Vec3, dst);
};
