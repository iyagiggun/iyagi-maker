"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const textureMap = {};
class IGObject {
    constructor(name, spriteInfo) {
        this.name = name;
        this.spriteInfo = spriteInfo;
    }
    getTexture() {
        const imageUrl = this.spriteInfo.imageUrl;
        if (!textureMap[imageUrl]) {
            textureMap[imageUrl] = pixi_js_1.BaseTexture.from(imageUrl);
        }
        return textureMap[imageUrl];
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const [x, y, w, h] = this.spriteInfo.area;
            yield new pixi_js_1.Spritesheet(this.getTexture(), {
                frames: {
                    [this.name]: {
                        'frame': { x, y, w, h }
                    },
                },
                meta: {
                    scale: '1'
                }
            }).parse();
            this.sprite = pixi_js_1.Sprite.from(this.name);
        });
    }
    getSprite() {
        if (!this.sprite) {
            throw new Error(`asset '${this.name}' is not loaded`);
        }
        return this.sprite;
    }
    bye() {
        console.error('bye');
    }
}
exports.default = IGObject;
