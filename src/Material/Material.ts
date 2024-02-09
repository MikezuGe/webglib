import type { Texture } from "../types";
import { loadAsset } from "../utils";

export class Material {
  public readonly textures: Texture[] = [];
  private _renderReady = false;

  public get renderReady(): boolean {
    return this._renderReady;
  }

  public static fromJSON(name: string): Material {
    const material = new Material();
    void Material.load(material, name);
    return material;
  }

  private static async load(material: Material, name: string): Promise<void> {
    const json = await loadAsset("material", name, "json");
    for (const { filename, type, format } of json.textures) {
      const source = await loadAsset("texture", filename, "png");
      const { width, height } = source;
      material.textures.push({
        type,
        source: await loadAsset("texture", filename, "png"),
        format,
        size: { width, height, depthOrArrayLayers: 1 },
      });
    }
    material._renderReady = true;
  }
}
