precision mediump float;

// 画面の解像度
uniform vec2 u_resolution;
// 開始からの時間経過
uniform float u_time;

// サークルを描画する関数
void circle(vec2 position,vec2 offset,float radius,vec3 color,inout vec3 i){
  float l=length(position-offset);
  if(l<radius){
    i=color;
  }
}

void main(){
  // 座標を正規化
  vec2 position=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  vec3 baseColor=vec3(.6353,.6431,.9059);
  
  vec3 circleColor1=vec3(.3373,.5098,.2784);
  vec2 offset1=vec2(cos(u_time*.6),sin(u_time*.4));
  float radius1=.3;
  circle(position,offset1,radius1,circleColor1,baseColor);
  
  vec3 circleColor2=vec3(.851,.4039,.2431);
  vec2 offset2=vec2(cos(u_time*.3+1.),sin(u_time*.7));
  float radius2=.1*cos(u_time)+.15;
  circle(position,offset2,radius2,circleColor2,baseColor);
  gl_FragColor=vec4(vec3(baseColor),1.);
}