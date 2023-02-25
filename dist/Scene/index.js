"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Tile_1 = require("../Object/Tile");
const Image_1 = require("../Utils/Image");
class IScene extends pixi_js_1.Container {
    constructor(tiles, objectList) {
        super();
        this.tiles = tiles;
        this.objectList = objectList;
    }
    load() {
        return Promise.all([
            ...this.tiles.reduce((acc, item) => acc.concat(item)).map(tile => tile.load()),
            ...this.objectList.map((obj) => obj.load())
        ]);
    }
    drawMap() {
        this.tiles.forEach((row, rowIdx) => row.forEach((tile, colIdx) => {
            const sprite = tile.getSprite();
            sprite.x = colIdx * Tile_1.TILE_SIZE;
            sprite.y = rowIdx * Tile_1.TILE_SIZE;
            this.addChild(sprite);
        }));
        this.objectList.forEach((obj) => {
            this.addChild(obj.getSprite());
        });
    }
    controll(target) {
        this.controllTarget = target;
        if (!this.controller) {
            this.controller = pixi_js_1.Sprite.from(Image_1.TRANSPARENT);
            this.controller.width = this.parent.width;
            this.controller.height = this.parent.height;
            this.controller.interactive = true;
            this.controller.addEventListener('touchstart', () => {
                console.error('start');
            });
            this.controller.addEventListener('touchmove', () => {
                console.error(333);
            });
            this.parent.addChild(this.controller);
        }
    }
}
exports.default = IScene;
