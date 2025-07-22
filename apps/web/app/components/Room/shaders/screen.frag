precision mediump float;

uniform sampler2D emissiveMap;

uniform float time;

varying vec2 vUv;

float rand(float n){return fract(sin(n) * 43758.5453123);}
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}


void main() {
    vec2 screenSpace;

    vec2 resolution = vec2(2000.0, 2000.0); // Default resolution, can be set to actual resolution if needed

    //Get the screen space coordinates
/*     screenSpace = gl_FragCoord.xy; */

    // Normalize the coordinates to the range [0, 1]
/*     vec2 color = screenSpace / resolution; */

// Get a horizontal noise value 
    float noiseValue = noise((vUv.y + time/80.0) * 1500.0);



    //Displace the uv coordinates based on the noise value
    vec2 displacedUv = vUv + vec2(noiseValue * 0.0025, 0.0);

    // 2D noise
    float noise = noise(vec2(rand(time/1000.0 + vUv*100.0))) - 0.5;




    gl_FragColor = vec4(texture2D(emissiveMap, displacedUv) * 1.5 + vec4(noise)/2.0);
  /*   gl_FragColor = vec4(color, 1.0, 1.0); */ // Uncomment to see a white screen
}