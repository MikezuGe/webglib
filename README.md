# Installing

```sh
npm install
```

# Development

```sh
npm start
```

then navigate to [localhost:1234](http://localhost:1234) with preferred browser. The webpage should reload every time a related file is saved.

# Testing

````sh
npm test

# Linting

```sh
npm run lint
````

# Renderer supports following uniforms

| Name            | Wgsl type | Description                                                            |
| --------------- | --------- | ---------------------------------------------------------------------- |
| uTime           | f32       | Milliseconds since application started                                 |
| uDefaultColor   | vec3f     | Color to use for all fragments by deafault                             |
| uView           | mat4x4f   | Current camera's world transformation                                  |
| uViewProjection | mat4x4f   | Current camera's world transformation and projection matrix multiplied |
| uModel          | mat4x4f   | Current gameobject's world transformation                              |

# When

# Renderer supports following textures and samplers

| Name   | Wgsl type       | Description               |
| ------ | --------------- | ------------------------- |
| tColor | texture_2d<f32> | Color texture             |
| sColor | -               | Sampler for color texture |

# TODO

- ~~Move all types to types folder~~
- Renderer renderpipeline should be created for meshes with same attributes and primitives, not for each mesh
- Add textures
  - Material should know properties of textures
  - Shaders should know which texture types are supported
  - When creating buffers
    - map through textures of material
    - find from shader if that texture is supported
      - Crash if no support
    - create buffers accordingly
- Shader -> Map texture to sampler name or other way around.
  - Make it simple for renderer to find matching sampler for texture
- ~~model uniform bindgroup should be created per transform~~
- Add light source
- Add normal maps
- Add light calculation
- Add
-

| Asset      | Property of | Load        | Description                                                     |
| ---------- | ----------- | ----------- | --------------------------------------------------------------- |
| Scene      | -           | Immediately | Holds gameobjects.                                              |
| GameObject | Scene       | Immediately | Holds model. Exposes transform to class that is extended by it. |
| Model      | GameObject  | Immediately | Holds meshes.                                                   |
| Mesh       | Model       | Immediately | Holds rendering related objects                                 |
| Shader     | Mesh        | Immediately | Holds shader code's info to create buffers                      |
| Geometry   | Mesh        | On demand   |                                                                 |
| Material   | Mesh        | Immediately |                                                                 |
| Texture    | Material    | On demand   |                                                                 |
