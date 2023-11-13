import * as THREE from 'three';

export class TextTexture extends THREE.CanvasTexture {
    constructor(text, { fontFamily, fontSize }) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const textWidth = context.measureText(text).width;
        canvas.width = textWidth + 20;
        canvas.height = fontSize + 20;

        context.font = `${fontSize}px ${fontFamily}`;
        context.fillStyle = 'rgba(255, 255, 255, 1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.fillText(text, 10, canvas.height / 2 + fontSize / 4);

        super(canvas);
    }
}