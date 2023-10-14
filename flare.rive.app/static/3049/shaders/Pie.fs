#ifdef GL_ES
precision highp float;
#endif

uniform float Size;
uniform float Antialias;

varying vec2 VRotation;
varying float VSize;
varying vec4 VColor;
varying float VAngle;
varying float VThickness;

vec4 outline(float distance, // Signed distance to line
	float linewidth, // Stroke line width
	float antialias, // Stroke antialiased area
	vec4 stroke, // Stroke color
	vec4 fill) // Fill color
{
	float t = linewidth / 2.0 - antialias;
	float signed_distance = distance;
	float border_distance = abs(signed_distance) - t;
	float alpha = border_distance / antialias;
	alpha = exp(-alpha * alpha);
	if( border_distance < 0.0 )
	{
		return stroke;
	}
	else if( signed_distance < 0.0 )
	{
		return mix(fill, stroke, sqrt(alpha));
	}
	else
	{
		return stroke * alpha;
	}
}

float disc(vec2 P, float size)
{
	return length(P) - size/2.0;
}

float pie(vec2 p, float angle)
{
	angle = radians(angle) / 2.0;
	vec2 n = vec2(cos(angle), sin(angle));
	return abs(p).x * n.x + p.y*n.y;
}

float circleDist(vec2 p, float radius)
{
	return length(p) - radius;
}

float semiCircleDist(vec2 P, float radius, float angle, float width)
{
	float r1 = length(P) - radius/2.0;
	float r2 = length(P) - (radius-width)/2.0;
	if(angle < 5.0)
	{
		return max(r1,-r2);
	}
	return max(-pie(P, angle), max(r1,-r2));
	/*width /= 2.0;
	radius -= width;
	return substract(pie(p, angle), 
					 abs(circleDist(p, radius)) - width);*/
}

const float StrokeThickness = 1.0;

void main()
{
	vec4 Stroke = vec4(1.0, 1.0, 1.0, 1.0);
	Stroke.rgb *= Stroke.a;
	vec2 P = gl_PointCoord.xy - vec2(0.5,0.5);
	P = vec2(VRotation.x*P.x - VRotation.y*P.y,VRotation.y*P.x + VRotation.x*P.y);
	//float distance = disc(P*VSize, Size);
	float distance = semiCircleDist(P*VSize, Size, VAngle, VThickness);
	gl_FragColor = outline(distance, StrokeThickness, Antialias, Stroke, VColor);
}