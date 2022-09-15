varying vec3 varyingDepthColor;
varying vec3 varyingSurfaceColor;
varying float varyingWavesElevation;
varying float varyingColorOffset;
varying float varyingColorMultiplier;

void main() {
    float colorMixStrength = (varyingWavesElevation + varyingColorOffset) * varyingColorMultiplier;
    vec3 mixedColor = mix(varyingDepthColor, varyingSurfaceColor, colorMixStrength);
    gl_FragColor = vec4(vec3(mixedColor), 1.0);
}