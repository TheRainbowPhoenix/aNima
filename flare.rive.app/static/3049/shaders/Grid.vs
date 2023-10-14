attribute vec2 VertexPosition;
attribute vec2 VertexTexCoord;

uniform mat4 ProjectionMatrix;
uniform mat4 WorldMatrix;

varying vec2 TexCoord;
varying vec2 VignetteCoord;

void main(void)
{
    TexCoord = (WorldMatrix * vec4(VertexTexCoord.x, VertexTexCoord.y, 0.0, 1.0)).xy;
    VignetteCoord = VertexTexCoord;
    vec4 pos = vec4(VertexPosition.x, VertexPosition.y, 0.0, 1.0);
    gl_Position = ProjectionMatrix * vec4(pos.xyz, 1.0);
}