uniform float time;
varying vec3 Normal;
varying vec3 Position;
varying vec3 pos;

void main() {
  vec3 newP;
  Normal = normal;
  newP = position;
  newP.y += abs(position.z)*sin(time*8.0); 
  Position = vec3(modelViewMatrix * vec4(position, 1.0));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newP, 1.0);
}