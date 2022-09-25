import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

// Gloabal variables
let debugGUI, canvas, scene, camera, controls, renderer, directionalLight;
let textureLoader, gltfLoader, cubeTextureLoader, material, customDepthMaterial;

// Constants
const clock = new THREE.Clock();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const debugParameters = {
    rotationSpeed: 0.4,
    rotationFunction: 0
};
const customUniforms = {
    uTime: { value: 0},
    uSpeed: { value: debugParameters.rotationSpeed },
    uAnimationFunction: { value: debugParameters.rotationFunction }
};

function init() {
    // Setup
    canvas = document.querySelector('canvas.webgl');
    scene = new THREE.Scene();

    // Loaders
    textureLoader = new THREE.TextureLoader();
    gltfLoader = new GLTFLoader()
    cubeTextureLoader = new THREE.CubeTextureLoader();

    // Environment
    const environmentMap = cubeTextureLoader.load([
        '/textures/environmentMaps/0/px.jpg',
        '/textures/environmentMaps/0/nx.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/ny.jpg',
        '/textures/environmentMaps/0/pz.jpg',
        '/textures/environmentMaps/0/nz.jpg'
    ]);
    environmentMap.encoding = THREE.sRGBEncoding;
    scene.background = environmentMap;
    scene.environment = environmentMap;

    // Textures
    const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg');
    mapTexture.encoding = THREE.sRGBEncoding;
    const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg');

    // Materials
    material = new THREE.MeshStandardMaterial({ map: mapTexture, normalMap: normalTexture });
    customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });

    // Models
    gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
        // Model
        const mesh = gltf.scene.children[0];
        mesh.rotation.y = Math.PI * 0.5;
        mesh.material = material;
        mesh.customDepthMaterial = customDepthMaterial;
        scene.add(mesh);

        // Update materials
        updateAllMaterials();
    });

    // Lights
    directionalLight = new THREE.DirectionalLight('#ffffff', 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 2, - 2.25);
    scene.add(directionalLight);

    // Camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(4, 1, - 4);
    scene.add(camera);

    // Controls
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function updateAllMaterials() {
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 1
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    });
}

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Update uniforms
    customUniforms.uTime.value = elapsedTime;
    customUniforms.uSpeed.value = debugParameters.rotationSpeed;
    customUniforms.uAnimationFunction.value = debugParameters.rotationFunction;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
}

function manageEvents() {
    window.addEventListener('resize', () => {       
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
}

function manageHooks() {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = customUniforms.uTime;
        shader.uniforms.uSpeed = customUniforms.uSpeed;
        shader.uniforms.uAnimationFunction = customUniforms.uAnimationFunction;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
                #include <common>
                uniform float uTime;
                uniform float uSpeed;
                uniform float uAnimationFunction;
    
                mat2 get2DRotationMatrix(float _angle) {
                    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
                }
    
                float simpleRotationAnimation() {
                    return (position.y + uTime) * uSpeed;
                }
    
                float simpleSinusRotationAnimation() {
                    return sin(simpleRotationAnimation() / uSpeed) * uSpeed;
                }
    
                float getRotationAngle() {
                    switch (int(uAnimationFunction)) {
                        case 0:
                            return simpleRotationAnimation();
                            break;
                        case 1:
                            return simpleSinusRotationAnimation();
                            break;
                        default:
                            return simpleRotationAnimation();
                            break;
                    }
                }
            `
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <beginnormal_vertex>',
            `
                #include <beginnormal_vertex>
    
                float angle = getRotationAngle();
                mat2 rotationMatrix = get2DRotationMatrix(angle);
    
                objectNormal.xz = rotationMatrix * objectNormal.xz;
            `
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>', 
            `
                #include <begin_vertex>
    
                transformed.xz = rotationMatrix * transformed.xz;
            `
        );
    }
    
    customDepthMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = customUniforms.uTime;
        shader.uniforms.uSpeed = customUniforms.uSpeed;
        shader.uniforms.uAnimationFunction = customUniforms.uAnimationFunction;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
                #include <common>
                uniform float uTime;
                uniform float uSpeed;
                uniform float uAnimationFunction;
    
                mat2 get2DRotationMatrix(float _angle) {
                    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
                }
    
                float simpleRotationAnimation() {
                    return (position.y + uTime) * uSpeed;
                }
    
                float simpleSinusRotationAnimation() {
                    return sin(simpleRotationAnimation() / uSpeed) * uSpeed;
                }
    
                float getRotationAngle() {
                    switch (int(uAnimationFunction)) {
                        case 0:
                            return simpleRotationAnimation();
                            break;
                        case 1:
                            return simpleSinusRotationAnimation();
                            break;
                        default:
                            return simpleRotationAnimation();
                            break;
                    }
                }
            `
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>', 
            `
                #include <begin_vertex>
    
                float angle = getRotationAngle();
                mat2 rotationMatrix = get2DRotationMatrix(angle);
                transformed.xz = rotationMatrix * transformed.xz;
            `
        );
    }
}

function setDebugPanel() {
    debugGUI = new dat.GUI();
    debugGUI.add(debugParameters, 'rotationSpeed').min(0).max(1).step(0.001);
    debugGUI.add(debugParameters, 'rotationFunction').min(0).max(2).step(1);
}

init();
manageHooks();
manageEvents();
setDebugPanel();
animate();