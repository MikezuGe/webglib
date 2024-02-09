import { Model } from "../Model";
import { Transform } from "../Transform";
import { loadAsset } from "../utils";

export class GameObject {
  public readonly transform = new Transform();
  public _model?: Model;

  public get model(): Model | undefined {
    return this._model;
  }

  public static fromJSON(name: string): GameObject {
    const gameObject = new GameObject();
    void GameObject.load(gameObject, name);
    return gameObject;
  }

  private static async load(
    gameObject: GameObject,
    name: string,
  ): Promise<void> {
    const json = await loadAsset("gameObject", name, "json");
    gameObject.transform.set(json.transform);
    gameObject._model = Model.fromJSON(json.model);
  }
}
