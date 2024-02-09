import { Geometry } from "../Geometry";
import { Material } from "../Material";
import { Shader } from "../Shader";
import { loadAsset } from "../utils";

export class Mesh {
  private _renderReady = false;
  private _geometry?: Geometry;
  private _material?: Material;
  private _shader?: Shader;

  public get renderReady(): boolean {
    if (this._renderReady) {
      return true;
    }
    this._renderReady =
      (this._geometry?.renderReady &&
        this._material?.renderReady &&
        this._shader?.renderReady) ??
      false;
    return this._renderReady;
  }

  public get geometry(): Geometry {
    return this._geometry!;
  }

  public get material(): Material {
    return this._material!;
  }

  public get shader(): Shader {
    return this._shader!;
  }

  public static fromJSON(name: string): Mesh {
    const mesh = new Mesh();
    void Mesh.load(mesh, name);
    return mesh;
  }

  public static async load(mesh: Mesh, name: string): Promise<void> {
    const json = await loadAsset("mesh", name, "json");
    mesh._geometry = Geometry.fromJSON(json.geometry);
    mesh._material = Material.fromJSON(json.material);
    mesh._shader = Shader.fromJSON(json.shader);
  }
}
