export type ICubeFaceName =
  | "back"
  | "bottom"
  | "front"
  | "left"
  | "right"
  | "top";

export type I3DVector = [number, number, number];

export type IAttribute = "color" | "normal" | "position";

export interface IGeometry {
  readonly stride: number;
  readonly strideBytes: number;
  readonly verticesByteLength: number;
  readonly attributes: GPUVertexAttribute[];
  useAttributes: (attributes: Record<IAttribute, GPUIndex32>) => void;
  generateVertices: (vertices: Float32Array) => void;
}
