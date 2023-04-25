"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTalkBox = void 0;
const pixi_js_1 = require("pixi.js");
const STYLE_NAME = new pixi_js_1.TextStyle({
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: 0xffffff,
});
const getMessageStyle = (width) => new pixi_js_1.TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: '600',
    wordWrap: true,
    wordWrapWidth: width - 40,
    fill: [0xffffff, 0xaaaaaa],
});
// eslint-disable-next-line import/prefer-default-export
const getTalkBox = (speaker, message, { width, height }) => {
    const tokens = message.split(' ');
    let tokenStartIdx = 0;
    let tokenEndIdx = 0;
    const talkBox = new pixi_js_1.Graphics();
    talkBox.beginFill(0x000000, 0.7);
    talkBox.drawRect(0, 0, Math.round(width / 2), height);
    talkBox.endFill();
    talkBox.x = talkBox.width;
    talkBox.y = 0;
    const photo = new pixi_js_1.Sprite(speaker.getPhoto().texture);
    photo.width = 144;
    photo.height = 144;
    photo.x = 15;
    photo.y = 15;
    talkBox.addChild(photo);
    const nameText = new pixi_js_1.Text(speaker.getName(), STYLE_NAME);
    nameText.x = photo.x + photo.width + 15;
    nameText.y = photo.y;
    talkBox.addChild(nameText);
    const messageText = new pixi_js_1.Text('', getMessageStyle(talkBox.width));
    messageText.x = 15;
    messageText.y = photo.y + photo.height + 15;
    talkBox.addChild(messageText);
    const isTextOverFlowed = () => talkBox.height > height;
    const showText = () => {
        while (tokenEndIdx <= tokens.length && !isTextOverFlowed()) {
            messageText.text = tokens.slice(tokenStartIdx, tokenEndIdx).join(' ');
            tokenEndIdx += 1;
        }
        if (isTextOverFlowed()) {
            tokenEndIdx -= 1;
            messageText.text = tokens.slice(tokenStartIdx, tokenEndIdx - 1).join(' ');
        }
        tokenStartIdx = tokenEndIdx;
    };
    showText();
    const talkEndPromise = new Promise((resolve) => {
        talkBox.interactive = true;
        talkBox.addEventListener('touchstart', (evt) => {
            evt.stopPropagation();
            if (tokenEndIdx > tokens.length) {
                resolve();
            }
            else {
                showText();
            }
        });
    });
    return {
        talkBox,
        talkEndPromise,
    };
};
exports.getTalkBox = getTalkBox;
