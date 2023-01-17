precision mediump float;

// 画面の解像度
uniform vec2 u_resolution;

void main(){
  // 座標を正規化
  vec2 position=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  gl_FragColor=vec4(vec3(length(position)),1.);
}