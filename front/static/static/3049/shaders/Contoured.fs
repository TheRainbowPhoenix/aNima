#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

uniform vec4 Color;
uniform float Opacity;
uniform sampler2D TextureSampler;
uniform float ContourScale;
varying vec2 TexCoord;

void main(void)
{
	float dist = ContourScale*(texture2D(TextureSampler, TexCoord).a-0.5);

	float afwidth = 0.7 * length ( vec2(dFdx(dist), dFdy(dist)));
	float threshold = 0.222;
	float factor = smoothstep (-threshold-afwidth, -threshold+afwidth, dist )-smoothstep (threshold-afwidth, threshold+afwidth, dist );
	vec4 color = Color;
	color.a *= factor*Opacity;
	gl_FragColor = color;
}