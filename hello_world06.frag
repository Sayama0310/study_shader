precision mediump float;

// 画面の解像度
uniform vec2 u_resolution;
// 開始からの時間経過
uniform float u_time;

void main(){
  // 座標を正規化
  vec2 position=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  vec3 color=vec3(.8,1.,.3);
  position+=vec2(cos(u_time*.6),sin(u_time*.4));
  
  // for文を使用することもできる
  float f=0.;
  for(float i=0.;i<10.;i++){
    float s=sin(u_time+i*.628318)*.2;
    float c=cos(u_time+i*.628318)*.2;
    f+=.0025/abs(length(position+vec2(c,s))-.5);
  }
  gl_FragColor=vec4(vec3(f*color),1.);
}