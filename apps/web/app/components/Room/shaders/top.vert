varying vec2 vUv;
varying vec3 vNormal;

varying vec4 vScreenPosition;
varying vec3 vPosition;

void main() {
    vNormal = normal;
    vUv = uv;
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenPosition = gl_Position;
}