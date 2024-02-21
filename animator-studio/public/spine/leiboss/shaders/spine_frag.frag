uniform sampler2D diffuse;
varying vec2 vUv;
varying vec4 vColor;
void main() {
    gl_FragColor = texture2D(diffuse, vUv);
    #if ALPHA_TEST == 1
    if(gl_FragColor.a<.5){
        discard;
    }

    #endif
    gl_FragColor *= vColor;
}
