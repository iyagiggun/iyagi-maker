import { SpriteInfo } from '..';
import { IObject } from '../..';

export default class ICharacter extends IObject {
  constructor(name: string, spriteInfo: SpriteInfo) {
    super(name, spriteInfo);
  }
}