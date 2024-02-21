#ifdef GL_ES
precision highp float;
#endif

varying vec4 Color;
uniform float Opacity;

void main(void)
{
    gl_FragColor = vec4(Color.xyz, Color.w*Opacity);
}