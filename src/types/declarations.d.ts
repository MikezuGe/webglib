// Ensure this file is treated as a module
export {};

declare module "*.wgsl" {
  const value: string;
  export default value;
}

declare global {
  export type DeepReadonly<T> = Readonly<
    T extends (infer R)[] ? DeepReadonly<R>[] : T
  >;

  export type AllOrNone<T> = T | { [K in keyof T]?: never };
}
