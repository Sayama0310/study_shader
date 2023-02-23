precision mediump float;
uniform vec2 u_resolution;

void main(){
    vec2 pos=gl_FragCoord.xy/u_resolution.xy;
    vec3 RED=vec3(1.,0.,0.);
    vec3 BLUE=vec3(0.,0.,1);
    // 線型補完を計算する関数はGLSLに組み込まれている
    // https://registry.khronos.org/OpenGL-Refpages/gl4/html/mix.xhtml
    vec3 color=mix(RED,BLUE,pos.x);
    gl_FragColor=vec4(color,1.);
}