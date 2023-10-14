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
	// Small grid coord
	vec2 coord = TexCoord*8.0;
	// Compute anti-aliased world-space grid lines
	vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
	float line = min(grid.x, grid.y);

	// Just visualize the grid lines directly
	float gridIntensitySmall = 1.0 - min(line, 1.0);

	// Large grid coord
	coord = TexCoord;
	// Compute anti-aliased world-space grid lines
	grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
	line = min(grid.x, grid.y);

	// Just visualize the grid lines directly
	float gridIntensityLarge = 1.0 - min(line, 1.0);

	// Line across origin x
	float coordOriginX = TexCoord.y+1.0;
	line = abs((coordOriginX - 0.5) - 0.5) / fwidth(coordOriginX);
	float originX = 1.0 - min(line, 1.0);

	// Line across origin y
	float coordOriginY = TexCoord.x+1.0;
	line = abs((coordOriginY - 0.5) - 0.5) / fwidth(coordOriginY);
	float originY = 1.0 - min(line, 1.0);

	float coord1 = (TexCoord.x+TexCoord.y)*32.0;

	// Compute anti-aliased world-space grid lines
	line = abs(fract(coord1 - 0.5) - 0.5) / fwidth(coord1)/0.5;

	// Just visualize the grid lines directly
	line = 1.0 - min(line, 1.0);


	float backgroundIntensity = 0.3628;
	float lineIntensity = ((originX*-0.17+originY*-0.17+gridIntensitySmall*0.04*SmallIntensity+gridIntensityLarge*0.04+line*0.03*DiagonalIntensity)*Opacity);

    vec4 color = vec4(vec3(backgroundIntensity+lineIntensity), 1.0);// * texture2D(VignetteSampler, VignetteCoord);
    gl_FragColor = vec4(/*vec3(1.0) - */color.rgb, 1.0);
}