#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision highp float;
#endif

uniform float DiagonalIntensity;
uniform float SmallIntensity;
uniform float Opacity;
uniform sampler2D VignetteSampler;

varying vec2 TexCoord;
varying vec2 VignetteCoord;

void main(void)
{
	// Line across origin x
	float coordOriginX = TexCoord.y+1.0;
	float line = abs((coordOriginX - 0.5) - 0.5) / fwidth(coordOriginX);
	float originX = 1.0 - min(line, 1.0);

	// Line across origin y
	float coordOriginY = TexCoord.x+1.0;
	line = abs((coordOriginY - 0.5) - 0.5) / fwidth(coordOriginY);
	float originY = 1.0 - min(line, 1.0);

	float backgroundIntensity = 0.3628;
	float lineIntensity = ((originX*-0.17+originY*-0.17)*Opacity);

    vec4 color = vec4(vec3(backgroundIntensity+lineIntensity), 1.0);
    gl_FragColor = vec4(color.rgb, 1.0);
}