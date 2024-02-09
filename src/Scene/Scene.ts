import { GameObject } from "../GameObject";
import { loadAsset } from "../utils";

export class Scene {
  public readonly gameObjects: GameObject[] = [];

  public static fromJSON(name: string): Scene {
    const scene = new Scene();
    void Scene.load(scene, name);
    return scene;
  }

  private static async load(scene: Scene, name: string): Promise<void> {
    const json = await loadAsset("scene", name, "json");
    for (const gameObjectName of json.gameObjects) {
      const gm = GameObject.fromJSON(gameObjectName);
      scene.gameObjects.push(gm);
    }
  }
}
