import {
  Graphics, Sprite, Text, TextStyle,
} from 'pixi.js';
import IObject from '../Object';

const STYLE_NAME = new TextStyle({
  fontSize: 30,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: 0xffffff,
});

const getMessageStyle = (width: number) => new TextStyle({
  fontFamily: 'Arial',
  fontSize: 24,
  fontWeight: '600',
  wordWrap: true,
  wordWrapWidth: width - 40,
  fill: [0xffffff, 0xaaaaaa],
});

// eslint-disable-next-line import/prefer-default-export
export const getTalkBox = (
  speaker: IObject,
  message: string,
  { width, height }: { width: number, height: number },
) => {
  const tokens = message.split(' ');
  let tokenStartIdx = 0;
  let tokenEndIdx = 0;

  const talkBox = new Graphics();
  talkBox.beginFill(0x000000, 0.7);
  talkBox.drawRect(0, 0, Math.round(width / 2), height);
  talkBox.endFill();
  talkBox.x = talkBox.width;
  talkBox.y = 0;

  const photo = new Sprite(speaker.getPhoto().texture);
  photo.width = 144;
  photo.height = 144;
  photo.x = 15;
  photo.y = 15;
  talkBox.addChild(photo);

  const nameText = new Text(speaker.getName(), STYLE_NAME);
  nameText.x = photo.x + photo.width + 15;
  nameText.y = photo.y;
  talkBox.addChild(nameText);

  const messageText = new Text('', getMessageStyle(talkBox.width));
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
