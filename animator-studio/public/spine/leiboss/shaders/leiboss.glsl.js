---
name: Leiboss
type: fragment
author: MiHoYo
---


precision mediump float;

uniform float size;
uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;



void main(void)
{

    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 white = vec3(1.0, 1.0, 1.0);
    bool color = (mod((fragCoord.y / resolution.y) * size, 1.0) > 0.5);

    if (!color) {
        gl_FragColor = vec4(white, 1.0);
    } else {
        gl_FragColor = vec4(black, 1.0);
    }

    if (gl_FragColor.x == 0.0 && gl_FragColor.y == 0.0 && gl_FragColor.z == 0.0)
    {
        gl_FragColor.a = 0.0;
    }
}
