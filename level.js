export class Level {
    map;
    tileSize;
    width;
    height;
    depth;
    selectedTile;

    constructor(width, height, depth, tileSize) {
        this.map = [];
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.tileSize = tileSize;
    }
}