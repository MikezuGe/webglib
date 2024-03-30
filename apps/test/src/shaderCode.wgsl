@group(0) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;
@group(0) @binding(1) var<uniform> modelMatrix: mat4x4<f32>;

struct VertexIn {
  @location(0) position: vec4f,
  @location(1) color: vec3f,
  @location(2) normal: vec3f
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
  @location(1) normal: vec3f
}

@vertex
fn vertex_main(vertexIn: VertexIn) -> VertexOutput {
  var output: VertexOutput;
  output.position = viewProjectionMatrix * modelMatrix * vertexIn.position;
  output.color = vertexIn.color;
  output.normal = vertexIn.normal;
  return output;
}

@fragment
fn fragment_main(fragmentData: VertexOutput) -> @location(0) vec4f {
  return vec4f(fragmentData.color, 0.0);
}
