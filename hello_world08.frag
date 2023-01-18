precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

// 複素数の２乗
vec2 cpow(vec2 c){
  return vec2(c.x*c.x-c.y*c.y,2.*c.x*c.y);
}

// マンデルブロ集合に属するか否かを判定する。
float calculateBrightness(vec2 c){
  vec2 z=vec2(0,0);
  const float maxIteration=50.;
  const float threshold=2.;
  
  for(float i=0.;i<maxIteration;i++){
    z=cpow(z);
    z+=c;
    if(length(z)>threshold){
      return i/maxIteration;
    }
  }
  return 1.;
}

void main(){
  vec2 c=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  c=c*1.5-vec2(.7,0.);// 座標を調整
  float brightness=calculateBrightness(c);
  vec3 color=vec3(.3373,.5098,.2784);
  gl_FragColor=vec4(color*(1.-brightness),1.);
}