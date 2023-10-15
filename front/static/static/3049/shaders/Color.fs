#ifdef GL_ES
precision highp float;
#endif

uniform vec4 Color;
uniform float Opacity;

void main(void)
{
    vec4 color = Color;
    color.a *= Opacity;
    gl_FragColor = color;
}