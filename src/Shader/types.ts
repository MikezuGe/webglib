import { FLOAT_BYTES, MAT4_BYTES } from "src/definitions";

interface IBufferDefinition {
  binding: number;
  offset: number;
  size: number;
}

type IBufferDefinitionMap = Record<string, IBufferDefinition>;

interface IUniformDefinition {
  bindGroup: number;
  bufferDefinitions: IBufferDefinitionMap;
}

type IUniformDefinitionMap = Record<string, IUniformDefinition>;

// prettier-ignore
const asd = {
  camera: {
    bindGroup: 0,
    bufferDefinitions: {
      time:           { binding: 0, offset: 0,          size: FLOAT_BYTES },
      view:           { binding: 1, offset: 0,          size: MAT4_BYTES },
      viewProjection: { binding: 1, offset: MAT4_BYTES, size: MAT4_BYTES },
      color:          { binding: 2, offset: 0,          size: FLOAT_BYTES * 3 },
    },
  },
  model: {
    bindGroup: 1,
    bufferDefinitions: {
      model: { binding: 0, offset: 0, size: MAT4_BYTES },
    }
  }
} satisfies IUniformDefinitionMap;

type Asd<T extends IUniformDefinitionMap> = {
  [K in keyof T]: {
    [U in keyof T[K]["bufferDefinitions"]]: U;
  };
};

export type IAsd = Asd<typeof asd>;
