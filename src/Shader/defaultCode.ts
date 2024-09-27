export const defaultCode = `
  struct VertexInput {
    @location(0) position: vec4f,
    @location(1) uv: vec2f,
    @location(2) color: vec4f
  }

  struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) color: vec4f
  }

  struct Camera {
    uView: mat4x4f,
    uProjection: mat4x4f,
  }

  @group(0) @binding(0) var<uniform> uTime: f32;
  @group(0) @binding(1) var<uniform> uCamera: Camera;
  @group(1) @binding(0) var sColor: sampler;
  @group(1) @binding(1) var tColor: texture_2d<f32>;
  @group(2) @binding(0) var<uniform> uModel: mat4x4f;

  @vertex
  fn vertex_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = uCamera.uProjection * uCamera.uView * uModel * input.position;
    output.uv = input.uv;
    output.color = input.color;
    return output;
  }
  
  @fragment
  fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
    return textureSample(tColor, sColor, input.uv);
    // return vec4f(1.0, 0.0, 0.0, 1.0);
    // return input.color;
    // return vec4f(input.uv, 0.0, 0.0);
  }
`;
