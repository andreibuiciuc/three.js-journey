import * as THREE from 'three';

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";

import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Resources from './Utils/Resources';

import sources from './sources.js';
import Debug from './Utils/Debug';

let experienceInstance = null;

/**
 * Experience class
 */
export default class Experience {
    constructor(allowGlobalAccess = false, canvas) {
        // Singleton
        if (experienceInstance) {
            return experienceInstance;
        }
        experienceInstance = this;

        // Global access
        if (allowGlobalAccess) {
            window.experience = this;
        }
        
        // Setup
        this.canvas = canvas;
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.resources = new Resources(sources);

        // three 
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        // Event listeners
        this.sizes.on('resize', () => {
            this.resize();
        });

        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
    
    update() {
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');
        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();

                for(const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });
        this.camera.controls.dispose();
        this.renderer.instance.dispose();
        if (this.debug.isActive) {
            this.debug.gui.destroy();
        }

    }
}