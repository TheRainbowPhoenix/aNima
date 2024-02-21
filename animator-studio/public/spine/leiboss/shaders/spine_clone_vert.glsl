attribute vec4 color;
varying vec2 vUv;
varying vec4 vColor;
uniform float opacity;
void main() {
  vUv = uv;
  vColor = color;
  vColor.a *= opacity;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
}
