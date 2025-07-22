precision mediump float;

uniform sampler2D emissiveMap;

uniform float time;
uniform vec2 resolution;
/* uniform vec3 cameraPosition; */

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    //Refraction shader with blur

    vec2 screenSpace;

    // Bias in the refraction map based on normal direction
    vec2 bias = vNormal.xy * 0.05; // Adjust the multiplier for more or less bias

    // Use gl_FragCoord (already perspective divided and in screen pixels)
    screenSpace = gl_FragCoord.xy / resolution;

    // Blur parameters
    float blurStrength = 0.0051; // Overall blur intensity
    int blurSamples = 8; // Reduced from 40 - diminishing returns after ~8-12 samples
    
    // Optimized box blur for refraction
    vec3 color = vec3(0.0);
    int halfSamples = blurSamples / 2;
    float invSampleCount = 1.0 / float((blurSamples + 1) * (blurSamples + 1)); // Pre-calculate division
    float sampleStep = blurStrength / float(blurSamples);
    
    for(int x = -halfSamples; x <= halfSamples; x++) {
        for(int y = -halfSamples; y <= halfSamples; y++) {
            vec2 offset = vec2(float(x), float(y)) * sampleStep;
            color += texture2D(emissiveMap, screenSpace + bias + offset).xyz;
        }
    }
    color *= invSampleCount; // Single multiplication instead of division

    // Phong reflection calculation (optimized)
    vec3 normal = normalize(vNormal);
    vec3 lightDir = vec3(0.0, 0.0, -1.0); // Pre-normalized (1,1,1)
    
    // Transmission factor and color for refractive material
    float transmissionFactor = 1.0; // How much light passes through (0.0 = opaque, 1.0 = fully transparent)
    vec3 transmissionColor = vec3(0.2, 1.0, 0.3) * 2.0; // Green tint for transmission
    vec3 transmission = color * transmissionFactor * transmissionColor;
    
    // Surface reflection (what we see reflected off the surface)
    float diff = max(dot(normal, lightDir), 0.2); // 0.2 acts as ambient
    vec3 surfaceReflection = diff * vec3(0.1, 0.1, 0.1); // Base surface color
    
    // Calculate Fresnel sheen effect based on viewing angle
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
    fresnel = pow(fresnel, 2.0); // Adjust power for sheen intensity
    
    // Sheen color and intensity
    vec3 sheenColor = vec3(1.0, 0.9, 0.8); // Warm white sheen
    float sheenStrength = 0.5; // Adjust for stronger/weaker sheen
    vec3 sheen = fresnel * sheenColor * sheenStrength;
    
    // Combine transmission, surface reflection, and sheen
    vec3 finalColor = transmission + surfaceReflection + sheen * 0.051 /* + surfaceReflection */;
    
    #ifdef USE_CAMERA_POSITION
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    finalColor += spec * 0.3; // Specular highlights
    #endif

    gl_FragColor = vec4(finalColor / 2.0, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}