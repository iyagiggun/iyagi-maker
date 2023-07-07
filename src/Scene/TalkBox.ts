import {
  Graphics, Sprite, Text, TextStyle,
} from 'pixi.js';
import Character from '../Obj/Character';

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
  speaker: Character,
  message: string,
  { width, height }: { width: number, height: number },
) => {
  const talkBox = new Graphics();
  talkBox.beginFill(0x000000, 0.7);
  talkBox.drawRect(0, 0, width, height / 2 - 48);
  talkBox.endFill();
  talkBox.x = 0;
  talkBox.y = height - talkBox.height;

  const photoSize = Math.min(144, height / 2);
  const photo = new Sprite(speaker.getPhoto().texture);
  photo.width = photoSize;
  photo.height = photoSize;
  photo.x = 12;
  photo.y = talkBox.height - photoSize - 12;
  talkBox.addChild(photo);

  const nameText = new Text(speaker.getName(), STYLE_NAME);
  nameText.x = photo.x + photo.width + 12;
  nameText.y = 6;
  talkBox.addChild(nameText);

  const messageTextWidth = talkBox.width - photoSize - 36;
  const messageText = new Text('', getMessageStyle(messageTextWidth));
  messageText.x = photo.x + photo.width + 12;
  messageText.y = nameText.y + nameText.height + 6;
  talkBox.addChild(messageText);

  const tokens = message.split(' ');
  let tokenStartIdx = 0;
  let tokenEndIdx = 0;

  const talkBoxHeight = talkBox.height;
  const isTextOverFlowed = () => talkBox.height > talkBoxHeight;
  const showText = () => {
    while (tokenEndIdx <= tokens.length && !isTextOverFlowed()) {
      tokenEndIdx += 1;
      messageText.text = tokens.slice(tokenStartIdx, tokenEndIdx).join(' ');
    }
    if (isTextOverFlowed()) {
      tokenEndIdx -= 1;
      messageText.text = tokens.slice(tokenStartIdx, tokenEndIdx).join(' ');
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
