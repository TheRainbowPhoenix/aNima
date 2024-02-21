uniform sampler2D diffuse;
varying vec2 vUv;
varying vec4 vColor;
void main() {
  gl_FragColor = texture2D(diffuse, vUv);
  if(gl_FragColor.a<.1){
    discard;
    }
  gl_FragColor *= vColor;
}
