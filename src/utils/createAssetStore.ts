interface AssetConstructor<T> {
  load: (asset: T) => Promise<void>;
  new (): T;
}

export const createAssetStore = <T extends { name: string }>(
  assetConstructor: AssetConstructor<T>,
  preload = false,
): ((name: string) => T) => {
  const store = new Map<string, T>();

  return (name: string) => {
    let asset = store.get(name);
    if (asset) {
      return asset;
    }
    asset = new assetConstructor();
    asset.name = name;
    store.set(name, asset);
    if (preload) {
      void assetConstructor.load(asset);
    }
    return asset;
  };
};
