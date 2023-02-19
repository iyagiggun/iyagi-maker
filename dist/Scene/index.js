"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class IScene extends pixi_js_1.Container {
    constructor(tiles) {
        super();
        this.tiles = tiles;
        console.error('igscene created');
    }
    hello() {
        console.error('hello igscene ');
    }
    load() {
        return Promise.all([...this.tiles.reduce((acc, item) => acc.concat(item)).map(tile => tile.load())]);
    }
    drawMap() {
        this.load().then(() => {
            this.tiles.forEach((row, rowIdx) => row.forEach((tile, colIdx) => {
                this.addChild(tile.getSprite());
                tile.getSprite().x = colIdx * 100;
            }));
        });
    }
}
exports.default = IScene;
