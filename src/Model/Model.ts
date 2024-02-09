import { Mesh } from "../Mesh";
import { loadAsset } from "../utils";

export class Model {
  private static readonly _models = new Map<string, Model>();
  private readonly _meshes: Mesh[] = [];

  public get meshes(): readonly Mesh[] {
    return this._meshes;
  }

  public static fromJSON(name: string): Model {
    let model = Model._models.get(name);
    if (model) {
      return model;
    }
    model = new Model();
    Model._models.set(name, model);
    void Model.load(model, name);
    return model;
  }

  public static async load(model: Model, name: string): Promise<void> {
    const json = await loadAsset("model", name, "json");
    for (const meshName of json.meshes) {
      model._meshes.push(Mesh.fromJSON(meshName));
    }
  }
}
