import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { Entity } from './entity';

export class Player extends Entity {
    constructor() {
        super();

        const loader = new GLTFLoader();

        loader.load('models/player.glb', (gltf) => {
            const model = gltf.scene;
            const animations = gltf.animations;

            this.model = model;

            this.model.scale.set(25, 25, 25);

            this.actions = animations;

            this.mixer = new THREE.AnimationMixer(this.model);

            const clip = THREE.AnimationClip.findByName(this.actions, 'CharacterArmature|Idle');
            const action = this.mixer.clipAction(clip);
            action.play();

        }, (xhr) => {
            console.log('model ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        }, (error) => {
            console.error(error);
        });
    }
}