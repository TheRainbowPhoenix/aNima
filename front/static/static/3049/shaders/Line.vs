#ifdef GL_ES
precision highp float;
#endif
attribute vec2 VertexPosition;

uniform mat4 ProjectionMatrix;
uniform mat4 WorldMatrix;
uniform vec2 Viewport;

void main(void)
{
    vec4 pos = WorldMatrix * vec4(VertexPosition.x, VertexPosition.y, 0.0, 1.0);
    vec4 p = ProjectionMatrix * vec4(pos.xyz, 1.0);

    vec2 screenCoord = (vec2(p.x, p.y) + 1.0)/2.0;
    vec2 snappedScreenCoord = floor(screenCoord * (Viewport-1.0))/(Viewport-1.0);
    vec2 glScreenCoord = snappedScreenCoord * 2.0 - 1.0;
    gl_Position = vec4(glScreenCoord.x, glScreenCoord.y, 0.0, 1.0);
}