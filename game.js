import * as THREE from 'three';

import { Level } from './level';
import { Player } from './player';

export class Game {
    camera;
    scene;
    renderer;
    raycaster;
    pointer;
    clock;
    level;
    player;
    entities;

    constructor() {
        this.setupRenderer();
        this.setupScene();
        this.setupLevel();
        this.setupLights();
        this.setupPlayer();

        this.clock = new THREE.Clock();

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.setupEventListeners();

        this.render = this.render.bind(this);

        this.render();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    setupScene() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(600, 600, 800);
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
    }

    setupLevel() {
        this.level = new Level(10, 10, 1, 50);

        const map = new THREE.TextureLoader().load('textures/floor.jpg');
        map.colorSpace = THREE.SRGBColorSpace;

        for (let i = 0; i < this.level.width; i++) {
            for (let j = 0; j < this.level.height; j++) {
                const geometry = new THREE.BoxGeometry(this.level.tileSize, 2, this.level.tileSize);

                const material = new THREE.MeshLambertMaterial({ color: 0xffffff, map: map });

                const tile = new THREE.Mesh(geometry, material);

                tile.position.x = i * this.level.tileSize - (this.level.width / 2) * this.level.tileSize;
                tile.position.z = j * this.level.tileSize - (this.level.height / 2) * this.level.tileSize;

                this.scene.add(tile);

                this.level.map.push(tile);
            }
        }
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x606060, 20);
        this.scene.add(ambientLight);
    }

    setupPlayer() {
        this.player = new Player();

        this.scene.add(this.player.model);
    }


    setupEventListeners() {
        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('pointerdown', this.onPointerDown);

        window.addEventListener('resize', this.onWindowResize);
    }

    render() {
        requestAnimationFrame(this.render);

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.render();
    }

    onPointerMove(event) {
        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.level.map, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            console.log('onPointerMove', intersect.object);
        }
    }

    onPointerDown(event) {
        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.level.map, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            console.log('onPointerDown', intersect.object);
        }

    }
}


/*
    if (tilePosition && objects) {
        let rotateAxis = new THREE.Vector3(0, 1, 0);
        let walkDirection = new THREE.Vector3();
        let rotateQuaternion = new THREE.Quaternion();

        let angle = Math.atan2(
            tilePosition.x - objects[0].position.x,
            tilePosition.z - objects[0].position.z);

        rotateQuaternion.setFromAxisAngle(rotateAxis, angle);
        objects[0].quaternion.rotateTowards(rotateQuaternion, 0.2);

        walkDirection.subVectors(tilePosition, objects[0].position).normalize();

        let moveX = walkDirection.x * walkSpeed;
        let moveY = walkDirection.y * walkSpeed;
        let moveZ = walkDirection.z * walkSpeed;

        objects[0].position.x += moveX;
        objects[0].position.y += moveY;
        objects[0].position.z += moveZ;
    }

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
*/