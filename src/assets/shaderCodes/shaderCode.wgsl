struct VertexInput {
  @location(0) position: vec4f,
  @location(1) uv: vec2f,
  @location(2) normal: vec4f
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) normal: vec4f
}

struct CameraUniforms {
  uView: mat4x4f,
  uViewProjection: mat4x4f
}

struct LightSources {
  position: vec3f,
  color: vec3f
}

@group(0) @binding(0) var<uniform> uTime: f32;
@group(0) @binding(1) var<uniform> uDefaultColor: vec3f;
@group(0) @binding(2) var<uniform> uCameraUniforms: CameraUniforms;
@group(1) @binding(0) var sColor: sampler;
@group(1) @binding(1) var tColor: texture_2d<f32>;
@group(2) @binding(0) var<uniform> uModel: mat4x4f;

@vertex
fn vertex_main (input: VertexInput) -> VertexOutput {
  var output: VertexOutput;

  var uT = uTime;
  var uColor = uDefaultColor;
  var uView = uCameraUniforms.uView;
  var uViewProjection = uCameraUniforms.uViewProjection;

  var aPosition = input.position;
  aPosition = uModel * aPosition;
  aPosition = uViewProjection * aPosition;
  
  var aNormal = input.normal;
  aNormal = abs(aNormal);

  var aUv = input.uv;

  output.position = aPosition;
  output.normal = aNormal;
  output.uv = aUv;

  return output;
}

@fragment
fn fragment_main (input: VertexOutput) -> @location(0) vec4f {
  return textureSample(tColor, sColor, input.uv);
  //return input.normal;
  //return vec4f(uDefaultColor, 1.0);
}
