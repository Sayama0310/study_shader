#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;

//start hash
uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u);
uvec3 u = uvec3(1, 2, 3);
const uint UINT_MAX = 0xffffffffu;
uint uhash11(uint n){
    n ^= (n << u.x);
    n ^= (n >> u.x);
    n *= k.x;
    n ^= (n << u.x);
    return n * k.x;
}
uvec2 uhash22(uvec2 n){
    n ^= (n.yx << u.xy);
    n ^= (n.yx >> u.xy);
    n *= k.xy;
    n ^= (n.yx << u.xy);
    return n * k.xy;
}
vec3 hash23(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return vec3(uhash22(n), uhash11(n.x+n.y)) / vec3(UINT_MAX);
}
//end hash

// 対象の点を囲う四隅の格子点の色を返却する
vec3[4] surround_lattice_color(vec2 position){
    vec2 left_down_point = floor(position);
    vec3[4] value;
    value[0] = hash23(left_down_point + vec2(0,0));
    value[1] = hash23(left_down_point + vec2(1,0));
    value[2] = hash23(left_down_point + vec2(0,1));
    value[3] = hash23(left_down_point + vec2(1,1));
    return value;
}

// 双線形補完
vec3 bilinear_interpolation(vec3[4] values, vec2 weight) {
    return mix(
        mix(values[0], values[1], weight.x),
        mix(values[2], values[3], weight.x),
        weight.y
    );
}

// エルミート補完の為の重みを計算
vec2 calculate_hermite_weight(vec2 position){
    vec2 weight = fract(position);
    weight = weight * weight * (3.0 -2.0 * weight);
    return weight;
}

void main(){
    vec2 position = gl_FragCoord.xy/min(u_resolution.x, u_resolution.y);
    position = 30.0 * position;
    fragColor = vec4(bilinear_interpolation(
            surround_lattice_color(position),
            calculate_hermite_weight(position)
        ), 1.0);
}