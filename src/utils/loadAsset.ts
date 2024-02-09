// @ts-expect-error - error
import * as anyAssetsUrls from "url:../assets/**/*";

import type {
  GameObjectJSON,
  GeometryJSON,
  MaterialJSON,
  MeshJSON,
  ModelJSON,
  SceneJSON,
  ShaderJSON,
} from "../types";

import { assertExists } from "./assertExists";

const assetUrls = anyAssetsUrls as Partial<
  Record<string, Partial<Record<string, string>>>
>;

interface AssetTypeToType {
  gameObject: GameObjectJSON;
  geometry: GeometryJSON;
  material: MaterialJSON;
  mesh: MeshJSON;
  model: ModelJSON;
  scene: SceneJSON;
  shader: ShaderJSON;
  shaderCode: string;
  texture: ImageBitmap;
}

interface AssetTypeToAssetLocation {
  gameObject: "gameObjects";
  geometry: "geometries";
  material: "materials";
  mesh: "meshes";
  model: "models";
  scene: "scenes";
  shader: "shaders";
  shaderCode: "shaderCodes";
  texture: "textures";
}

interface AssetTypeToExtension {
  gameObject: "json";
  geometry: "json";
  material: "json";
  mesh: "json";
  model: "json";
  scene: "json";
  shader: "json";
  shaderCode: "wgsl";
  texture: "png" | "jpg";
}

const assetTypeToAssetLocation: AssetTypeToAssetLocation = {
  gameObject: "gameObjects",
  geometry: "geometries",
  material: "materials",
  mesh: "meshes",
  model: "models",
  scene: "scenes",
  shader: "shaders",
  shaderCode: "shaderCodes",
  texture: "textures",
};

const getAssetLocationByType = <T extends keyof AssetTypeToAssetLocation>(
  type: T,
): AssetTypeToAssetLocation[T] => {
  const location = assetTypeToAssetLocation[type];
  assertExists(location, `Invalid asset type: ${type}`);
  return location;
};

export const loadAsset = async <T extends keyof AssetTypeToType>(
  type: T,
  name: string,
  extension: AssetTypeToExtension[T],
): Promise<AssetTypeToType[T]> => {
  console.log(type, name, extension);
  const location = getAssetLocationByType(type);
  const fileName = `${name}.${extension}`;
  const url = assetUrls[location]?.[fileName];
  assertExists(
    url,
    `Asset not found: assets/${location}/${fileName}, url: ${url}`,
  );
  const res = await fetch(url);
  switch (type) {
    case "gameObject":
    case "geometry":
    case "material":
    case "mesh":
    case "model":
    case "scene":
    case "shader":
      return (await res.json()) as AssetTypeToType[T];
    case "shaderCode":
      return (await res.text()) as AssetTypeToType[T];
    case "texture":
      const blob = await res.blob();
      const imageBitmap = await createImageBitmap(blob, {
        colorSpaceConversion: "none",
      });
      return imageBitmap as AssetTypeToType[T];
    default:
      throw new Error(`Invalid extension: ${extension}`);
  }
};
