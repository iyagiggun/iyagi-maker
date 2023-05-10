import {
  Graphics, Sprite, Text, TextStyle,
} from 'pixi.js';
import IObject from '../Object';

const STYLE_NAME = new TextStyle({
  fontSize: 24,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: 0xffffff,
});

const getMessageStyle = (width: number) => new TextStyle({
  fontFamily: 'Arial',
  fontSize: 18,
  wordWrap: true,
  wordWrapWidth: width,
  fill: [0xffffff, 0xaaaaaa],
});

// eslint-disable-next-line import/prefer-default-export
export const getTalkBox = (
  speaker: IObject,
  message: string,
  { width, height }: { width: number, height: number },
) => {
  const talkBox = new Graphics();
  talkBox.beginFill(0x000000, 0.7);
  talkBox.drawRect(0, 0, Math.round(width / 2) - 100, height);
  talkBox.endFill();
  talkBox.x = width - talkBox.width;
  talkBox.y = 0;

  const photo = new Sprite(speaker.getPhoto().texture);
  photo.width = 108;
  photo.height = 108;
  photo.x = 12;
  photo.y = 12;
  talkBox.addChild(photo);

  const nameText = new Text(speaker.getName(), STYLE_NAME);
  nameText.x = 12;
  nameText.y = photo.y + photo.height + 12;
  talkBox.addChild(nameText);

  const messageText = new Text('', getMessageStyle(talkBox.width - 24));
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

  const talkEndPromise = new Promise<void>((resolve) => {
    talkBox.interactive = true;
    talkBox.addEventListener('touchstart', (evt) => {
      evt.stopPropagation();
      if (tokenEndIdx > tokens.length) {
        resolve();
      } else {
        showText();
      }
    });
  });

  return {
    talkBox,
    talkEndPromise,
  };
};
