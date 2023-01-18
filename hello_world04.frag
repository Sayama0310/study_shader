precision mediump float;

// 画面の解像度
uniform vec2 u_resolution;

void main(){
  // 座標を正規化
  vec2 position=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  
  // sin, cos, abs なども使える
  vec3 rattice = vec3(0.05 / abs(cos(position.x * 20.0)*sin(position.y * 20.0)));
  gl_FragColor=vec4(abs(rattice),1.);
}