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
  const talkBox = new Graphics();
  const talkBoxWidth = Math.round(width / 2);

  talkBox.width = talkBoxWidth;
  talkBox.x = talkBoxWidth;
  talkBox.y = 0;
  talkBox.beginFill(0x000000, 0.7);
  talkBox.drawRect(0, 0, talkBoxWidth, height);
  talkBox.endFill();

  const photo = new Sprite(speaker.getPhoto().texture);
  photo.width = 144;
  photo.height = 144;
  photo.x = 15;
  photo.y = 15;
  talkBox.addChild(photo);

  const nameText = new Text(speaker.getName(), STYLE_NAME);
  nameText.x = 15;
  nameText.y = photo.y + photo.height + 15;
  talkBox.addChild(nameText);

  const messageText = new Text(message, getMessageStyle(talkBoxWidth));
  messageText.x = 15;
  messageText.y = nameText.y + nameText.height + 15;
  talkBox.addChild(messageText);

  return talkBox;
};
