uniform float uniformWavesElevation;
uniform vec2 uniformWavesFrequency;
uniform float uniformTime;
uniform float uniformWavesSpeed;
uniform vec3 uniformDepthColor;
uniform vec3 uniformSurfaceColor;
uniform float uniformColorOffset;
uniform float uniformColorMultiplier;

// For performance improvements
varying vec3 varyingDepthColor;
varying vec3 varyingSurfaceColor;
varying float varyingWavesElevation;
varying float varyingColorOffset;
varying float varyingColorMultiplier;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uniformWavesFrequency.x + uniformTime * uniformWavesSpeed) * uniformWavesElevation; 
    elevation *= sin(modelPosition.z * uniformWavesFrequency.y + uniformTime * uniformWavesSpeed);
    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    varyingDepthColor = uniformDepthColor;
    varyingSurfaceColor = uniformSurfaceColor;
    varyingWavesElevation = elevation;
    varyingColorOffset = uniformColorOffset;
    varyingColorMultiplier = uniformColorMultiplier;
}