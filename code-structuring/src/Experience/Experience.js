import * as THREE from 'three';

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";

import Camera from './Camera';

/**
 * Experience class
 */
export default class Experience {
    constructor(allowGlobalAccess = false, canvas) {
        // Global access
        if (allowGlobalAccess) {
            window.experience = this;
        }
        
        // Setup
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();

        // three 
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();

        // Event listeners
        this.sizes.on('resize', () => {
            this.resize();
        });

        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() {

    }
    
    update() {

    }
}