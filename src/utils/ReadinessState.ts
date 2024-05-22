import { ReadyState } from "src/types";

export class ReadinessState {
  public static readonly uninitialized = ReadyState.uninitialized;
  public static readonly preparing = ReadyState.preparing;
  public static readonly initialized = ReadyState.initialized;

  private _state: ReadyState = ReadinessState.uninitialized;

  public isUninitialized(): boolean {
    return this._state === ReadinessState.uninitialized;
  }

  public isPreparing(): boolean {
    return this._state === ReadinessState.preparing;
  }

  public isInitialized(): boolean {
    return this._state === ReadinessState.initialized;
  }

  public isStateOrThrow(state: ReadyState): void {
    if (this._state === state) {
      return;
    }
    throw new Error(`Readiness state is not ${state}`);
  }

  public notStateOrThrow(state: ReadyState): void {
    if (this._state !== state) {
      return;
    }
    throw new Error(`Readiness state is ${state}`);
  }

  public setState(state: ReadyState): void {
    this._state = state;
  }
}
