#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec2 u_resolution;

void main(){
    vec2 pos=gl_FragCoord.xy/u_resolution.xy;
    vec3[4]col4=vec3[](
        vec3(.9804,.2745,.2745),
        vec3(.5647,.5294,.8353),
        vec3(0.,.5608,.6745),
        vec3(.6078,.2314,.5529)
    );
    // ４点の色を線織面によって補完する。
    // 線形補完のネストで実現可能。
    vec3 col=mix(
        mix(col4[0],col4[1],pos.x),
        mix(col4[2],col4[3],pos.x),
        pos.y
    );
    fragColor=vec4(col,1.);
}
