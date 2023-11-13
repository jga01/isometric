import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { Entity } from './entity';

export class Player extends Entity {
    velocity;
    targetTile;
    currentAction;

    constructor() {
        super();

        this.velocity = 5;
    }

    loadModel(modelPath) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();

            loader.load(modelPath, (gltf) => {
                const model = gltf.scene;
                const animations = gltf.animations;

                this.model = model;
                this.model.scale.set(25, 25, 25);

                this.mixer = new THREE.AnimationMixer(this.model);

                animations.forEach((animation) => {
                    const action = this.mixer.clipAction(animation);
                    this.actions[animation.name.split('|')[1]] = action;
                });

                this.actions['Idle'].play();

                this.currentAction = 'Idle';

                resolve(model);
            }, (xhr) => {
                console.log('model ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            }, reject);
        });
    }

    updatePosition() {
        if (this.targetTile) {
            const distance = this.model.position.distanceTo(this.targetTile);

            if (distance > 5) {
                const direction = new THREE.Vector3().subVectors(this.targetTile, this.model.position).normalize();
                const newPosition = this.model.position.clone().add(direction.multiplyScalar(this.velocity));

                if (newPosition.distanceTo(this.targetTile) < distance) {
                    this.model.position.copy(newPosition);
                    this.model.rotation.y = Math.atan2(direction.x, direction.z);

                    if (this.currentAction != 'Run') {
                        this.actions['Run'].play();
                        this.currentAction = 'Run';
                    }
                } else {
                    this.model.position.copy(this.targetTile);
                    this.actions[this.currentAction].stop();
                    this.actions[this.currentAction].fadeOut(0.5);

                    this.currentAction = 'Idle';
                }
            } else {
                this.targetTile = null;
                this.actions[this.currentAction].stop();
                this.currentAction = 'Idle';
                this.actons[this.currentAction].play();
            }
        }
    }
}