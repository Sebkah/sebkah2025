varying vec2 vUv;
uniform float time;
void main() {
    vUv = uv;

    //Make the text wave
    float wave = sin(position.x * 2.0 + time * 5.0) * 0.1;
    vec3 pos = position;
    pos.y += wave * 0.4;
    pos.z += wave * 0.5; // Add some depth to the wave effect
    pos.x += wave * 0.2; // Add some horizontal movement to the wave
    pos.x += sin(time * 2.0 + position.y * 5.0) * 0.05; // Add some horizontal oscillation
    pos.y += sin(time * 3.0 + position.x * 5.0) * 0.05; // Add some vertical oscillation
    pos.z += sin(time * 4.0 + position.y * 5.0) * 0.05; // Add some depth oscillation


 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}