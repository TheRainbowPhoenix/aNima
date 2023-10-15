#ifdef GL_ES
precision highp float;
#endif
attribute vec2 VertexPosition;

uniform mat4 ProjectionMatrix;
uniform mat4 WorldMatrix;

void main(void)
{
    gl_Position = ProjectionMatrix * WorldMatrix * vec4(VertexPosition.x, VertexPosition.y, 0.0, 1.0);
}