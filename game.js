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
        this.onKeypress = this.onKeyPress.bind(this);
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
                const geometry = new THREE.BoxGeometry(this.level.tileSize, 1, this.level.tileSize);

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

    async setupPlayer() {
        this.player = new Player();
        this.player.loadModel('models/playernew.glb')
            .then((loadedModel) => {
                this.scene.add(loadedModel);
                this.player.addChatBubble('Hello! world', this.scene);
            })
            .catch((error) => {
                console.log('Error loading model:', error);
            })
    }


    setupEventListeners() {
        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('pointerdown', this.onPointerDown);
        document.addEventListener('keypress', this.onKeyPress);

        window.addEventListener('resize', this.onWindowResize);
    }

    removeEventListeners() {
        document.removeEventListener('pointermove', this.onPointerMove);
        document.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('resize', this.onWindowResize);
    }

    render() {
        requestAnimationFrame(this.render);

        if (this.player.mixer) {
            this.player.mixer.update(this.clock.getDelta());
        }

        this.player.updatePosition();

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
            const intersectedTile = intersects[0].object;

            if (this.level.highlightedTile) {
                this.level.highlightedTile.material.color.set(0xffffff);
            }

            intersectedTile.material.color.set(0xff0000);

            this.level.highlightedTile = intersectedTile;
        } else {
            if (this.level.highlightedTile) {
                this.level.highlightedTile.material.color.set(0xffffff);
                this.level.highlightedTile = null;
            }
        }
    }

    onPointerDown(event) {
        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.level.map, false);

        if (intersects.length > 0) {
            const intersectedTile = intersects[0];

            const targetPosition = new THREE.Vector3().copy(intersectedTile.point);

            this.player.targetTile = targetPosition;
        }

    }

    onKeyPress(event) {
        console.log(event);
        switch(event.code) {
            case "KeyW":
                console.log(event);
                // this.player.actions['Wave'].play();
                break;
        }
    }
}