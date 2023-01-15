precision mediump float;
uniform vec2 u_resolution; // 画面の解像度
uniform float u_time;      // 開始からの時間経過

void main(){
  vec2 coord = (gl_FragCoord.xy / u_resolution);
  vec3 color = vec3(0.0);
  vec2 translate = vec2(-0.5, -0.5); // 中心座標
  coord += translate;

  float radius = 0.3;     // サークルの直径
  float speed = 20.0;     // 回転の角度と速度
  float dsize = 0.0003;   // 点の直径

  for (int i = 0; i < 60; i++){
    float rad = radians(360.0 / speed * sin(u_time)) * float(i);
    color += dsize / length(coord + vec2(radius * cos(rad), radius * sin(rad)));
  }

  // 背景色
  color.r /= -coord.y;
  color.g /= coord.y;
  color.b += sin(coord.x * 3.0 - 4.71) * 0.5;

  gl_FragColor = vec4(color, 1.0);
}