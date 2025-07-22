

varying vec3 Normal;

	varying vec2 vUv;



void main() {
     Normal = normal;
        vUv = uv;


    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}