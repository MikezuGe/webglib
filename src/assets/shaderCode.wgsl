struct VertexInput {
  @location(0) position: vec3f
}

struct VertexOutput {
  @builtin(position) position: vec4f
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
  var time = uTime;
  output.position = cameraUniforms.viewProjection * model * vec4f(input.position, 1.0);
  return output;
}

@fragment
fn fragment_main (input: VertexOutput) -> @location(0) vec4f {
  return vec4f(defaultColor, 1.0);
}
