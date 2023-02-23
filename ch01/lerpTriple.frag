#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec2 u_resolution;

void main(){
    vec2 pos=gl_FragCoord.xy/u_resolution.xy;
    vec3[3]col3=vec3[](
        vec3(1.,0.,0.),
        vec3(0.1176, 0.0, 1.0),
        vec3(0.102, 1.0, 0.0)
    );
    pos.x*=2.;
    // int() は入力の float 値の整数部分を出力する
    int ind=int(pos.x);
    // fract() は入力の float 値の小数部分を出力する
    // 正確には x >> x - <float of x> となる
    // 従って -1.8 >> -1.8 - (-2) = 0.2 である
    vec3 col=mix(col3[ind],col3[ind+1],fract(pos.x));
    fragColor=vec4(col,1.0);
}
