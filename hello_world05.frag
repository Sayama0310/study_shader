precision mediump float;

// 画面の解像度
uniform vec2 u_resolution;
// 開始からの時間経過
uniform float u_time;

void main(){
  // 座標を正規化
  vec2 position=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  
  // 時間変化させてみる
  position+=vec2(cos(position+u_time)+sin(position));
  
  vec3 orb=vec3(.1/length(position));
  gl_FragColor=vec4((orb)-.3,1.);
}