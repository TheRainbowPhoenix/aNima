attribute vec2 VertexPosition;
attribute vec4 VertexBoneIndices;
attribute vec4 VertexWeights;
attribute vec4 PaintBoneIndices;
attribute vec4 PaintWeights;

uniform mat4 ProjectionMatrix;
uniform mat4 WorldMatrix;
uniform mat4 ViewMatrix;

uniform vec3 BoneMatrices[82];

// Currently support a max of 41 bones.
uniform vec4 BoneColors[41];

varying vec4 Color;


void main(void)
{
	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

	vec2 position = vec2(0.0, 0.0);

	vec4 p = WorldMatrix * vec4(VertexPosition.x, VertexPosition.y, 0.0, 1.0);
	float x = p[0];
	float y = p[1];

	for(int i = 0; i < 4; i++)
	{
		float weight = VertexWeights[i];

		int matrixIndex = int(VertexBoneIndices[i])*2;
		vec3 m = BoneMatrices[matrixIndex];
		vec3 n = BoneMatrices[matrixIndex+1];

		position[0] += (m[0] * x + m[2] * y + n[1]) * weight;
		position[1] += (m[1] * x + n[0] * y + n[2]) * weight;

		color += BoneColors[int(PaintBoneIndices[i])] * PaintWeights[i];
    }
    Color = color;
    vec4 pos = ViewMatrix * vec4(position.x, position.y, 0.0, 1.0);
    gl_Position = ProjectionMatrix * vec4(pos.xyz, 1.0);
}