#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
void main(){
    vec2 pos=gl_FragCoord.xy/u_resolution.xy;
    // (x,y) の範囲を [0,32]*[0,9] にする
    pos*=vec2(32.,9.);
    float time = 10000. * u_time;
    uint[9]a=uint[](
        uint(time),
        0xbu,
        9u,
        0xbu^9u,
        0xffffffffu,
        0xffffffffu+0x2u,
        floatBitsToUint(floor(time)),
        floatBitsToUint(-1.125),
        floatBitsToUint(11.5625)
    );
    if(fract(pos.x)<.1){
        if(floor(pos.x)==1.){
            fragColor=vec4(1,0,0,1);
        }else if(floor(pos.x)==9.){
            fragColor=vec4(0,1,0,1);
        }else{
            fragColor=vec4(.5);
        }
    }else if(fract(pos.y)<.1){
        fragColor=vec4(.5);
    }else{
        uint b=a[int(pos.y)];
        b=(b<<uint(pos.x))>>31;
        fragColor=vec4(vec3(b),1.);
    }
    
}