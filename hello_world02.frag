precision mediump float;

uniform vec2 u_resolution;

void main(){
    vec2 st=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
    
    // もっとカラフルな感じにもできます
    gl_FragColor=vec4(vec3(st.x,st.y,u_resolution.x+u_resolution.y),1.);
}