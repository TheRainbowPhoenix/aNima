
uniform sampler2D diffuse1;
uniform sampler2D diffuse2;
varying vec2 vUv;
uniform float progress;

void main() {
    vec4 color1 = texture2D(diffuse1, vUv);
    vec4 color2 = texture2D(diffuse2, vUv);
  vec4 color = mix(color1, color2, step(vUv.y, progress));
  gl_FragColor = color;
}
