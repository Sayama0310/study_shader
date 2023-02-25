#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
int channel;

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
uvec3 uhash33(uvec3 n){
    n ^= (n.yzx << u);
    n ^= (n.yzx >> u);
    n *= k;
    n ^= (n.yzx << u);
    return n * k;
}
float hash11(float p){
    uint n = floatBitsToUint(p);
    return float(uhash11(n)) / float(UINT_MAX);
}
float hash21(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return float(uhash22(n).x) / float(UINT_MAX);
}
float hash31(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return float(uhash33(n).x) / float(UINT_MAX);
}
vec2 hash22(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return vec2(uhash22(n)) / vec2(UINT_MAX);
}
vec3 hash33(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return vec3(uhash33(n)) / vec3(UINT_MAX);
}
//end hash

// 対象の点を囲う四隅の格子点の色を返却する
float[4] surround_lattice_color(vec2 position){
    vec2 left_down_point = floor(position);
    float[4] value;
    value[0] = hash21(left_down_point + vec2(0,0));
    value[1] = hash21(left_down_point + vec2(1,0));
    value[2] = hash21(left_down_point + vec2(0,1));
    value[3] = hash21(left_down_point + vec2(1,1));
    return value;
}

// 対象の点を囲う四隅の格子点の色を返却する in 3D
float[8] surround_3d_lattice_color(vec3 position){
    vec3 left_down_point = floor(position);
    float[8] value;
    value[0] = hash31(left_down_point + vec3(0,0,0));
    value[1] = hash31(left_down_point + vec3(1,0,0));
    value[2] = hash31(left_down_point + vec3(0,1,0));
    value[3] = hash31(left_down_point + vec3(1,1,0));
    value[4] = hash31(left_down_point + vec3(0,0,1));
    value[5] = hash31(left_down_point + vec3(1,0,1));
    value[6] = hash31(left_down_point + vec3(0,1,1));
    value[7] = hash31(left_down_point + vec3(1,1,1));
    return value;
}

// 双線形補完
float bilinear_interpolation(float[4] values, vec2 weight) {
    return mix(
        mix(values[0], values[1], weight.x),
        mix(values[2], values[3], weight.x),
        weight.y
    );
}

// 双線形補完 in 3D
float bilinear_3d_interpolation(float[8] values, vec3 weight) {
    return mix(
            mix(
                mix(values[0], values[1], weight.x),
                mix(values[2], values[3], weight.x),
                weight.y
            ),
            mix(
                mix(values[4], values[5], weight.x),
                mix(values[6], values[7], weight.x),
                weight.y
            ),
            weight.z
        );
}

// 線形な重みを計算
vec2 calculate_linear_weight(vec2 position){
    vec2 weight = fract(position);
    return weight;
}

// エルミート補完の為の重みを計算
vec2 calculate_hermite_weight(vec2 position){
    vec2 weight = fract(position);
    weight = weight * weight * (3.0 -2.0 * weight);
    return weight;
}

// エルミート補完の為の重みを計算
vec3 calculate_hermite_3d_weight(vec3 position){
    vec3 weight = fract(position);
    weight = weight * weight * (3.0 -2.0 * weight);
    return weight;
}

void main(){
    vec2 position = gl_FragCoord.xy/min(u_resolution.x, u_resolution.y);
    channel = int(gl_FragCoord.x * 3.0 / u_resolution.x);
    position = 10.0 * position;
    if (channel == 0) {
        // 双線形補完
        fragColor = vec4(bilinear_interpolation(
            surround_lattice_color(position),
            calculate_linear_weight(position)
        ));
    } else if (channel == 1) {
        // 双エルミート補完
        fragColor = vec4(bilinear_interpolation(
            surround_lattice_color(position),
            calculate_hermite_weight(position)
        ));
    } else if (channel == 2) {
        // 緩やかな時間変化する双エルミート補完
        fragColor = vec4(bilinear_3d_interpolation(
            surround_3d_lattice_color(vec3(position, u_time)),
            calculate_hermite_3d_weight(vec3(position, u_time))
        ));
    }
    fragColor.a = 1.0;
}