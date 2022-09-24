import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import EventEmitter from './EventEmiiter';

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();
        // Options
        this.sources = sources;
        // Setup
        this.items = [];
        this.sourcesToLoad = this.sources.length;
        this.sourcesLoaded = 0;
        
        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    startLoading() {
        this.sources.forEach(source => {
            switch(source.type) {
                case 'gltfModel':
                    this.loaders.gltfLoader.load(source.path, (file) => { this.onSourceLoaded(source, file); });
                    break;
                case 'texture':
                    this.loaders.textureLoader.load(source.path, (file) => { this.onSourceLoaded(source, file); });
                    break;
                case 'cubeTexture':
                    this.loaders.cubeTextureLoader.load(source.path, (file) => { this.onSourceLoaded(source, file); });
                    break;
                default:
                    break;
            }
        });
    }

    onSourceLoaded(source, file) {
        this.items[source.name] = file;
        this.sourcesLoaded = this.sourcesLoaded + 1;
        if (this.sourcesLoaded === this.sourcesToLoad) {
            this.trigger('loaded');
        }
    }
}