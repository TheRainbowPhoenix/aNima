#ifdef GL_ES
precision highp float;
#endif
attribute vec2 Position;
attribute vec4 Color;
attribute float Rotation;
attribute float Thickness;
attribute float Angle;

uniform mat4 ProjectionMatrix;
uniform mat4 ViewMatrix;
uniform float Size;
uniform float Antialias;

const float SQRT_2 = 1.4142135623730951;
varying vec2 VRotation;
varying float VSize;
varying vec4 VColor;
varying float VAngle;
varying float VThickness;

const float StrokeThickness = 1.0;

void main (void)
{	
	float r = radians(Rotation);
	VRotation = vec2(cos(r), sin(r));
	VColor = Color;
	VAngle = Angle;
	VThickness = Thickness;
	gl_Position = ProjectionMatrix * ViewMatrix * vec4(Position, 0.0, 1.0);
	VSize = SQRT_2 * Size + 2.0*(StrokeThickness + 1.5*Antialias);
	gl_PointSize = VSize;
}