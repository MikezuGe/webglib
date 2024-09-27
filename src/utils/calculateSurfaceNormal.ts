import { vec3n } from "wgpu-matrix";

import { N0, N1, N2, N3 } from "../definitions";

const temp1Vec3 = vec3n.create();
const temp2Vec3 = vec3n.create();
const temp3Vec3 = vec3n.create();

export const calculateSurfaceNormal = (
  v1: number[],
  v2: number[],
  v3: number[],
  dst: number[],
): void => {
  if (v1.length > N3 || v2.length > N3 || v3.length > N3) {
    throw new Error("Vectors must have 3 components");
  }

  temp1Vec3[N0] = v2[N0] - v1[N0];
  temp1Vec3[N1] = v2[N1] - v1[N1];
  temp1Vec3[N2] = v2[N2] - v1[N2];

  temp2Vec3[N0] = v3[N0] - v1[N0];
  temp2Vec3[N1] = v3[N1] - v1[N1];
  temp2Vec3[N2] = v3[N2] - v1[N2];

  temp3Vec3[N0] = temp1Vec3[N1] * temp2Vec3[N2] - temp1Vec3[N2] * temp2Vec3[N1];
  temp3Vec3[N1] = temp1Vec3[N2] * temp2Vec3[N0] - temp1Vec3[N0] * temp2Vec3[N2];
  temp3Vec3[N2] = temp1Vec3[N0] * temp2Vec3[N1] - temp1Vec3[N1] * temp2Vec3[N0];

  const length = Math.sqrt(
    temp3Vec3[N0] * temp3Vec3[N0] +
      temp3Vec3[N1] * temp3Vec3[N1] +
      temp3Vec3[N2] * temp3Vec3[N2],
  );

  dst[N0] = temp3Vec3[N0] / length;
  dst[N1] = temp3Vec3[N1] / length;
  dst[N2] = temp3Vec3[N2] / length;
};
