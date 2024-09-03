import { Mesh } from "../Mesh";
import { createAssetStore, loadAsset } from "../utils";

export class Model {
  private static readonly _models = createAssetStore(Model, true);
  public readonly name = "";
  private readonly _meshes: Mesh[] = [];

  public get meshes(): readonly Mesh[] {
    return this._meshes;
  }

  public static fromJSON(name: string): Model {
    return Model._models(name);
  }

  public static async load(model: Model): Promise<void> {
    const json = await loadAsset("model", model.name, "json");
    for (const meshName of json.meshes) {
      model._meshes.push(Mesh.fromJSON(meshName));
    }
  }
}
