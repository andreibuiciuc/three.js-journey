import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

/**
 * CONFIGURATION
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugParameters = {
    depthColor: '#186691',
    surfaceColor: '#9bd8ff'
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * OBJECTS
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uniformWavesElevation: { value: 0.2 },
        uniformWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uniformTime: { value: 0},
        uniformWavesSpeed: { value: 0.75 },
        uniformDepthColor: { value: new THREE.Color(debugParameters.depthColor) },
        uniformSurfaceColor: { value: new THREE.Color(debugParameters.surfaceColor) },
        uniformColorOffset: { value: 0.08 },
        uniformColorMultiplier: { value: 5 },
        uniformSmallWavesElevation: { value: 0.15 },
        uniformSmallWavesFrequency: { value: 3 },
        uniformSmallWavesSpeed: { value: 0.2 },
        uniformSmallWavesIterations: { value: 4}
    }
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = - Math.PI * 0.5;
scene.add(water);

/**
 * SIZES
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * CAMERA
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * ANIMATION
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Update objects
    waterMaterial.uniforms.uniformTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

/**
 * DEBUG PANEL CONFIGURATION
 */
gui.add(waterMaterial, 'wireframe');
gui.add(waterMaterial.uniforms.uniformWavesElevation, 'value').name('Elevation').min(0).max(1).step(0.001);
gui.add(waterMaterial.uniforms.uniformWavesFrequency.value, 'x').name('Frequency x-axis').min(0).max(10).step(0.001);
gui.add(waterMaterial.uniforms.uniformWavesFrequency.value, 'y').name('Frequency z-axis').min(0).max(10).step(0.001);
gui.add(waterMaterial.uniforms.uniformWavesSpeed, 'value').name('Waves speed').min(0).max(5).step(0.001);

gui.addColor(debugParameters, 'depthColor').
    name('Depth color')
    .onChange(() => { waterMaterial.uniforms.uniformDepthColor.value.set(debugParameters.depthColor) });
gui.addColor(debugParameters, 'surfaceColor')
    .name('Surface color')
    .onChange(() => { waterMaterial.uniforms.uniformSurfaceColor.value.set(debugParameters.surfaceColor) });

gui.add(waterMaterial.uniforms.uniformColorOffset, 'value').name('Color offset').min(0).max(1).step(0.001);
gui.add(waterMaterial.uniforms.uniformColorMultiplier, 'value').name('Color multiplier').min(0).max(10).step(0.001);

gui.add(waterMaterial.uniforms.uniformSmallWavesElevation, 'value').name('Small waves speed').min(0).max(1).step(0.001);
gui.add(waterMaterial.uniforms.uniformSmallWavesFrequency, 'value').name('Small waves frequency').min(0).max(30).step(0.001);
gui.add(waterMaterial.uniforms.uniformSmallWavesSpeed, 'value').name('Small waves speed').min(0).max(4).step(0.001);
gui.add(waterMaterial.uniforms.uniformSmallWavesIterations, 'value').name('Small waves iterations').min(0).max(4).step(1);


tick();
