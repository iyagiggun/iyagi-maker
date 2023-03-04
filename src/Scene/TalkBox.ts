import { Application, Graphics, Text, TextStyle } from 'pixi.js';
import IObject from '../Object';

const MESSAGE_BOX_HEIGHT = 200;
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

export const getTalkBox = (speaker: IObject, message: string, app: Application) => {
  const talkBox = new Graphics();
  const width = app.view.width / 2;
  talkBox.beginFill(0x000000, 0.7);
  talkBox.drawRect(app.view.width - width, 0, width, app.view.height);
  talkBox.endFill();

  const nameText = new Text(speaker.getName(), STYLE_NAME);
  talkBox.addChild(nameText);

  const messageText = new Text(message, getMessageStyle(width));
  messageText.x = width + 20;
  messageText.y = MESSAGE_BOX_HEIGHT;
  talkBox.addChild(messageText);

  return talkBox;
};