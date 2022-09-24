import * as THREE from 'three';

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";

import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Resources from './Utils/Resources';

import sources from './sources.js';

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
        this.renderer.update();
    }
}