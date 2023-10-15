attribute vec2 VertexPosition;
attribute vec2 VertexTexCoord;
attribute vec4 VertexBoneIndices;
attribute vec4 VertexWeights;

uniform mat4 ProjectionMatrix;
uniform mat4 WorldMatrix;
// Currently support a max of 41 bones.
uniform vec4 BoneColors[41];

varying vec4 Color;

void main(void)
{
	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

	for(int i = 0; i < 4; i++)
	{
		float weight = VertexWeights[i];
		int idx = int(VertexBoneIndices[i]);

		color += BoneColors[idx] * weight;
    }
    Color = color;
    vec4 pos = WorldMatrix * vec4(VertexPosition.x, VertexPosition.y, 0.0, 1.0);
    gl_Position = ProjectionMatrix * vec4(pos.xyz, 1.0);
}