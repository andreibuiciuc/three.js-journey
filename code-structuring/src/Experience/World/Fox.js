import * as THREE from 'three';
import Experience from '../Experience';

export default class Fox {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        // Setup
        this.resource = this.resources.items.foxModel;

        this.setModel();
        this.setAnimation();

        this.setDebug();
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(0.02, 0.02, 0.02);
        this.scene.add(this.model);

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        });
    }

    setAnimation() {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        this.animation.actions = {};
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]); 
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]); 
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]); 

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        this.animation.play = (name) => {
            const newAnimationAction = this.animation.actions[name];
            const oldAnimationAction = this.animation.actions.current;
            newAnimationAction.reset();
            newAnimationAction.play();
            newAnimationAction.crossFadeFrom(oldAnimationAction, 1);
            this.animation.actions.current = newAnimationAction;
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }

    setDebug() {
        if (this.debug.isActive) {
            this.debugFoxFolder = this.debug.gui.addFolder('Fox');
            const debugObject = {
                playIdle: () => { this.animation.play('idle'); },
                playWalking: () => { this.animation.play('walking'); },
                playRunning: () => { this.animation.play('running'); }
            }
            this.debugFoxFolder.add(debugObject, 'playIdle');
            this.debugFoxFolder.add(debugObject, 'playWalking');
            this.debugFoxFolder.add(debugObject, 'playRunning');
        }
    }

}