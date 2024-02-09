export abstract class Geometry {
  public abstract readonly vertices: Float32Array;
  private _renderReady = false;

  public get renderReady(): boolean {
    return this._renderReady;
  }
}
