"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTalkBox = void 0;
const pixi_js_1 = require("pixi.js");
const STYLE_NAME = new pixi_js_1.TextStyle({
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: 0xffffff,
});
const getMessageStyle = (width) => new pixi_js_1.TextStyle({
    fontFamily: 'Arial',
    fontSize: 18,
    wordWrap: true,
    wordWrapWidth: width,
    fill: [0xffffff, 0xaaaaaa],
});
// eslint-disable-next-line import/prefer-default-export
const getTalkBox = (speaker, message, { width, height }) => {
    const talkBox = new pixi_js_1.Graphics();
    talkBox.beginFill(0x000000, 0.7);
    talkBox.drawRect(0, 0, Math.round(width / 2) - 100, height);
    talkBox.endFill();
    talkBox.x = width - talkBox.width;
    talkBox.y = 0;
    const photo = new pixi_js_1.Sprite(speaker.getPhoto().texture);
    photo.width = 108;
    photo.height = 108;
    photo.x = 12;
    photo.y = 12;
    talkBox.addChild(photo);
    const nameText = new pixi_js_1.Text(speaker.getName(), STYLE_NAME);
    nameText.x = 12;
    nameText.y = photo.y + photo.height + 12;
    talkBox.addChild(nameText);
    const messageText = new pixi_js_1.Text('', getMessageStyle(talkBox.width - 24));
    messageText.x = 12;
    messageText.y = nameText.y + nameText.height + 12;
    talkBox.addChild(messageText);
    const tokens = message.split(' ');
    let tokenStartIdx = 0;
    let tokenEndIdx = 0;
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
