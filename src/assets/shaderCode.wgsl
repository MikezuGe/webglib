struct VertexInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) normal: vec4f
}

struct CameraUniforms {
  view: mat4x4f,
  viewProjection: mat4x4f
}

@group(0) @binding(0) var<uniform> uTime: f32;
@group(0) @binding(1) var<uniform> cameraUniforms: CameraUniforms;
@group(0) @binding(2) var<uniform> defaultColor: vec3f;
@group(1) @binding(0) var<uniform> model: mat4x4f;

@vertex
fn vertex_main (input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  var aPosition = input.position;
  var aNormal = input.normal;

  var time = uTime;
  var aView = cameraUniforms.view;
  var aViewProjection = cameraUniforms.viewProjection;
  var aColor = defaultColor;
  var aModel = model;

  output.position = aViewProjection * aModel * vec4f(aPosition, 1.0);
  output.normal = vec4f(abs(aNormal), 1.0);

  return output;
}

@fragment
fn fragment_main (input: VertexOutput) -> @location(0) vec4f {
  var aColor = defaultColor;
  return input.normal;
  // return vec4f(defaultColor, 1.0);
}
