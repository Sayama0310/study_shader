#version 300 es
precision highp float;
uniform vec2 u_resolution;
out vec4 fragColor;

const float PI=3.1415926;

float atan2(float y,float x){
    if(x==0.){
        return sign(y)*PI/2.;
    }else{
        // GLSLに組み込まれている関数で、x!=0の時に偏角を求める
        // https://registry.khronos.org/OpenGL-Refpages/gl4/html/atan.xhtml
        // 偏角の範囲は-PI <= atan(y,x) <= PI
        return atan(y,x);
    }
}

vec2 xy2pol(vec2 xy){
    // 直交座標 xy >> 極座標 θr に変換
    // x=0 のときは θ=sign(y)*PI/2
    return vec2(atan2(xy.y,xy.x),length(xy));
}

vec2 pol2xy(vec2 pol){
    // 極座標 θr >> 直交座標 xy に変換
    return pol.t*vec2(cos(pol.s),sin(pol.s));
}

vec3 tex(vec2 pol){
    vec3[3]col3=vec3[](
        vec3(.4863,.5765,.2471),
        vec3(.5294,.2667,.2667),
        vec3(.349,.4784,.6314)
    );
pol.s=pol.s/PI+1.;// 偏角の範囲を [0,2) に変換
    int ind=int(pol.s);// 画面下は ind=0 , 画面上は ind=1
    vec3 col=mix(col3[ind%2],col3[(ind+1)%2],fract(pol.s));
    return mix(col3[2],col,pol.t);
}

void main(){
    vec2 pos=gl_FragCoord.xy/u_resolution;
    pos=2.*pos.xy-vec2(1.);// 座標を [-1,1] に変換
    pos=xy2pol(pos);
    fragColor=vec4(tex(pos),1.);
}
