import * as THREE from 'three';
import Experience from "../Experience";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Setup
        this.setSunlight();
        this.setEnvironmentMap();
        this.setDebug();
    }

    setSunlight() {
        this.sunlight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunlight.castShadow = true
        this.sunlight.shadow.camera.far = 15
        this.sunlight.shadow.mapSize.set(1024, 1024)
        this.sunlight.shadow.normalBias = 0.05
        this.sunlight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunlight);
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.3;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.encoding = THREE.sRGBEncoding;
        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse(child => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }
        this.environmentMap.updateMaterials();
    }

    setDebug() {
        if (this.debug.isActive) {
            this.debugEnvironmentFolder = this.debug.gui.addFolder('Environment');

            this.debugEnvironmentFolder
                .add(this.sunlight, 'intensity')
                .min(0).max(4).step(0.001)
                .name('light intensity')
                .onChange(this.environmentMap.updateMaterial);
                
            this.debugEnvironmentFolder
                .add(this.sunlight.position, 'x')
                .min(-5).max(5).step(0.001)
                .name('light x position')
                .onChange(this.environmentMap.updateMaterial);

            this.debugEnvironmentFolder
                .add(this.sunlight.position, 'y')
                .min(-5).max(5).step(0.001)
                .name('light y position')
                .onChange(this.environmentMap.updateMaterial);
                
            this.debugEnvironmentFolder
                .add(this.sunlight.position, 'z')
                .min(-5).max(5).step(0.001)
                .name('light z position')
                .onChange(this.environmentMap.updateMaterial);
        }
    }
}