#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform float u_time;
int channel;

void main(){
    vec2 pos=gl_FragCoord.xy/u_resolution.xy;
    // 画面の左側だけを poterization する
    channel=int(2.*gl_FragCoord.x/u_resolution.x);
    
    float n=6.;
    pos*=n;
    if(channel==0){
        // 1/n 等分したステップ関数
        // 不連続関数であるため、縁辺対比という錯視が起きる
        pos=floor(pos)+step(.5,fract(pos));
    }else{
        float thr=.1*sin(u_time)+.1;
        // smoothstep(a,b,x) は以下のように定義される
        // 0          where x < a
        // t^2(3-2t)  otherwise (where t = (x-a)/(b-a))
        // 1          where b < x
        pos=floor(pos)+smoothstep(.5-thr,.5+thr,fract(pos));
    }
    
    pos/=n;
    vec3[4]col4=vec3[](
        vec3(.9804,.2745,.2745),
        vec3(.5647,.5294,.8353),
        vec3(0.,.5608,.6745),
        vec3(.6078,.2314,.5529)
    );
    vec3 col=mix(
        mix(col4[0],col4[1],pos.x),
        mix(col4[2],col4[3],pos.x),
        pos.y
    );
    fragColor=vec4(col,1.);
}
