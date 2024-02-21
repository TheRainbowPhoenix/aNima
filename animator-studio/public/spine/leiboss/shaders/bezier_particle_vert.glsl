
#define PI 3.1415926535
#define TWO_PI 6.283185307

attribute float posFract;
attribute float id;

uniform vec3 startMin;
uniform vec3 startMax;

uniform vec3 endMin;
uniform vec3 endMax;

uniform vec2 speed;
uniform vec2 size;
uniform vec2 alpha;

uniform float lifeCurve;
uniform float time;
uniform float imgNum;

float hash11(float seed) {
  return fract(sin(seed*12345.67)*753.5453123);
}

vec2 hash12(float seed){
  vec3 rnd = fract(vec3(seed) * vec3(.1031, .1030, .0973));
  rnd += dot(rnd, rnd.yzx + 33.33);
  return fract((rnd.xx+rnd.yz)*rnd.zy);
}

vec3 hash13(float seed){
  vec3 rnd = fract(seed * vec3(5.3983, 5.4427, 6.9371));
  rnd += dot(rnd.zxy, rnd.xyz + vec3(21.5351, 14.3137, 15.3219));
  return fract(vec3(rnd.x * rnd.y * 95.4337, rnd.y * rnd.z * 97.597, rnd.z * rnd.x * 93.8365));
}


#if LOOP_COUNT > 0
  uniform float startTime;
#endif

// 定义贝塞尔模式
#if USE_BEZIER == 1
  uniform vec3 ctrMin;
  uniform vec3 ctrMax;
  vec3 calcBezier(vec3 a, vec3 b, vec3 c, float t){
    float s = 1.-t;
    vec3 q = s*s*a + 2.*s*t*b + t*t*c;
    return q;
  }
#endif

// 定义sin 随机模式
#if USE_WIGGLE > 0
  uniform vec3 freqMin;
  uniform vec3 freqMax;
  uniform vec3 ampMin;
  uniform vec3 ampMax;
  uniform vec3 delayMin;
  uniform vec3 delayMax;

  vec3 calcWiggle(vec3 freq, vec3 amp, vec3 delay, float timeValue){
    vec3 value = vec3(0.);
    vec3 nowAmp = vec3(1.);
    float baseFreq = 1. / (2. - 1. / pow(2., float(USE_WIGGLE)));
    float nowFreq = baseFreq;
    vec3 ampCount = vec3(0.);
    for (int i = 0; i < USE_WIGGLE; i++) {
      value += nowAmp * sin(timeValue * nowFreq * TWO_PI / freq + delay);
      nowFreq = baseFreq * pow(2., float(i + 1));
      ampCount += nowAmp;
      nowAmp *= .5;
    }
    return value / ampCount * amp;
  }
#endif

// 定义自转模式
#if USE_ROTATE == 1
uniform vec3 rotMin;
uniform vec3 rotMax;
vec3 calcRotate( vec3 shape, vec3 speed, float timeValue ){
  vec3 r = speed * timeValue;
  float a = sin(r.x); float b = cos(r.x); 
  float c = sin(r.y); float d = cos(r.y);
  float e = sin(r.z); float f = cos(r.z);
  float ac = a*c;
  float bc = b*c;
  mat3 rota = mat3( d*f,d*e,-c,ac*f-b*e,ac*e+b*f,a*d,bc*f+a*e,bc*e-a*f,b*d);
  return rota*shape;
}
#endif

// 定义普通follow path模式
#if FOLLOW_PATH == 1
mat3 lookAtNormal(vec3 origin, vec3 target) {
\tvec3 ww = normalize(target - origin);  
\tvec3 rr = vec3(0., sign(ww.x), 0.0);
\tvec3 uu = normalize(cross(ww, rr));
\tvec3 vv = normalize(cross(uu, ww));
\treturn -mat3(ww, vv, uu);
}
#elif FOLLOW_PATH == 2
// 定义拖尾长度
uniform float tailLen;
// 定义一直看向摄像头的模式
vec3 lookAtLine(vec3 top, vec3 bottom, vec3 shape){
  vec3 A = cameraPosition - bottom;
  vec3 B = top - bottom;
  vec3 C = normalize(cross(A, B));
  vec3 start = bottom + normalize(B)*shape.y;
  vec3 newPosition = mix(top, bottom, uv.y);
  newPosition += shape.x * C;
  return newPosition;
}
#endif

// 定义闪烁
#if USE_BLINK > 0
uniform vec3 blink;
float calcBlink(float x,float  y,float z,float w){
  return smoothstep(x-z, x+z, w)*smoothstep(y+z, y-z, w);
}
#endif 

// 定义重力
#if USE_GRAVITY == 1
uniform vec3 gravityMin;
uniform vec3 gravityMax;
vec3 gravity;
#endif

// 定义形状渐变
#if USE_SCALE == 1
uniform vec2 scale;
#endif

varying vec2 vUv;
varying float vOpacity;

vec3 startPnt;
#if USE_BEZIER == 1
vec3 controlPnt;
#endif
vec3 endPnt;

#if USE_WIGGLE > 0
vec3 wiggleFreq;
vec3 wiggleAmp;
vec3 wiggleDelay;
#endif

#if USE_ROTATE == 1
vec3 rotSpeed;
#endif

float newSize;
float snowOpacity;

void initValue(float cycleCount){
  // 普通模式
  startPnt = mix(startMin,startMax,hash13(id+cycleCount));
  endPnt = mix(endMin,endMax,hash13(id+cycleCount+200.));
  #if DELTA_OFFSET == 1
    endPnt += startPnt;
  #endif
  #if USE_BEZIER == 1
    controlPnt = mix(ctrMin,ctrMax,hash13(id+cycleCount+100.));
    #if DELTA_OFFSET == 1
      controlPnt += startPnt;
    #endif
  #endif

  #if USE_WIGGLE > 0
    wiggleFreq = mix(freqMin,freqMax,hash13(id+cycleCount+10.));
    wiggleAmp = mix(ampMin,ampMax,hash13(id+cycleCount+20.));
    wiggleDelay = mix(delayMin,delayMax,hash13(id+cycleCount+30.));
  #endif  

  #if USE_ROTATE == 1
    rotSpeed = mix(rotMin,rotMax,hash13(id+cycleCount+40.));
  #endif

  #if USE_GRAVITY == 1
    gravity = mix(gravityMin,gravityMax,hash13(id+cycleCount+50.));
  #endif

  
  snowOpacity =  mix(alpha.x,alpha.y,hash11(id+cycleCount+700.));
}



vec3 calcOffsetByTime(float timeValue,float delta){
  // remap time with curve < 1 为ease-out > 1为ease-in
  float life = pow(fract(timeValue)+delta, lifeCurve);

  #if USE_BEZIER == 0
    vec3 offset = startPnt;
  #elif USE_BEZIER == 1
    vec3 offset = calcBezier(startPnt, controlPnt, endPnt, life);
  #else
    vec3 offset = mix(startPnt, endPnt, life);
  #endif

  #if USE_GRAVITY == 1
    offset = mix(offset, endPnt+gravity,life);
  #endif

  #if USE_WIGGLE > 0
    offset += calcWiggle(wiggleFreq, wiggleAmp, wiggleDelay, timeValue+delta);
  #endif

  return offset;
}


void main() {
  float sizeRnd = hash11(id+600.);
  newSize = mix(size.x,size.y,sizeRnd);
  #if FOLLOW_SIZE == 1
  float newSpeed = mix(speed.x,speed.y,sizeRnd);
  #else
  float newSpeed = mix(speed.x,speed.y,hash11(id+700.));
  #endif

  #if LOOP_COUNT > 0
    float wholeLife = ((time-startTime) * newSpeed + posFract)-1.;
    float life = wholeLife;
    life += (1.-posFract)*(1.-newSpeed/speed.y);//增加补偿慢速粒子初始life值, 防止慢速粒子过晚出现.
    if(life>=0.&&life<float(LOOP_COUNT)){
      life = fract(life);
    }else{
      life = clamp(life,0.,1.);
    }
    float cycleCount = floor(wholeLife);
  #else
    float wholeLife = (time * newSpeed + posFract);
    float life = fract(wholeLife);
    #if LOOP_COUNT == -1
      float cycleCount = 0.;
    #else
      float cycleCount = floor(wholeLife);
    #endif
  #endif

  initValue(cycleCount);

  #if MULTI_IMGS == 1
    float imgRnd = hash11(id+cycleCount+12.3);
    vUv = vec2((uv.x+floor(imgRnd*imgNum))/imgNum,uv.y);
  #else
    vUv = uv;
  #endif

  vOpacity = snowOpacity;

  #if USE_FADE > 0
    vOpacity *= smoothstep(0.,.2, sin(life*PI));
  #endif

  #if USE_BLINK > 0
    vec2 blinkRnd = hash12(id+cycleCount+1000.);
    vOpacity *= mix(blink.x,blink.y,calcBlink(.1, .5, .2, sin(time*blink.z*(.5+.5*blinkRnd.x)+blinkRnd.y*TWO_PI)*.5+.5));
  #endif

  vec3 scalePos = position * newSize;

  #if USE_SCALE == 1
    scalePos *= mix(scale.x,scale.y,life);
  #endif

  #if USE_BLINK == 2
    scalePos *= vOpacity;
  #endif

  vec3 offset = calcOffsetByTime(wholeLife,0.);
  // 旋转跟随路径
  #if FOLLOW_PATH == 1  
    vec3 offsetNext = calcOffsetByTime(wholeLife,.01);
    offset += lookAtNormal(offsetNext, offset)*scalePos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset, 1.0);  
  // 旋转跟随路径 并始终朝向摄像机 适合平面做方向线条
  #elif FOLLOW_PATH == 2 
    vec3 offsetNext = calcOffsetByTime(wholeLife,.01*tailLen);
    offset = lookAtLine(offsetNext, offset, scalePos);
    gl_Position = projectionMatrix * viewMatrix * vec4(offset, 1.0);
  // 不跟随路径 可以支持自转
  #else  
    #if USE_ROTATE == 1
      scalePos = calcRotate(scalePos, rotSpeed, wholeLife);
    #endif
    
    offset += scalePos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset, 1.0);
  #endif
}
