import * as THREE from 'three';
import Experience from "../Experience";
import Environment from './Environment';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Text mesh
        const testMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
        this.scene.add(testMesh);

        // Setup
        this.resources.on('loaded', () => {
            this.environment = new Environment();
        })
    }
}