#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
ivec2 channel;

const uint UINT_MAX = 0xffffffffu;
uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u);
uvec3 u = uvec3(1, 2, 3);
uvec2 uhash22(uvec2 n){
    n ^= (n.yx << u.xy);
    n ^= (n.yx >> u.xy);
    n *= k.xy;
    n ^= (n.yx << u.xy);
    return n * k.xy;
}
uvec3 uhash33(uvec3 n){
    n ^= (n.yzx << u);
    n ^= (n.yzx >> u);
    n *= k;
    n ^= (n.yzx << u);
    return n * k;
}
vec2 hash22(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return vec2(uhash22(n)) / vec2(UINT_MAX);
}
vec3 hash33(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return vec3(uhash33(n)) / vec3(UINT_MAX);
}
float hash21(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return float(uhash22(n).x) / float(UINT_MAX);
    //nesting approach
    //return float(uhash11(n.x+uhash11(n.y)) / float(UINT_MAX)
}
float hash31(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return float(uhash33(n).x) / float(UINT_MAX);
    //nesting approach
    //return float(uhash11(n.x+uhash11(n.y+uhash11(n.z))) / float(UINT_MAX)
}

void main()
{
    float time = floor(60.* u_time);
    vec2 position = gl_FragCoord.xy + time;
    channel = ivec2(gl_FragCoord.xy * 2.0 / u_resolution.xy);
    if (channel[0] == 0){ //left
        if (channel[1] == 0){ // low
            fragColor.rgb = vec3(hash21(position));
        } else { // high
            fragColor.rgb = vec3(hash22(position), 1.0);
        }
    } else {    //right
        if (channel[1] == 0){ // low
            fragColor.rgb = vec3(hash31(vec3(position, time)));
        } else { // high
            fragColor.rgb = hash33(vec3(position, time));
        }
    }
    fragColor.a = 1.0;
}