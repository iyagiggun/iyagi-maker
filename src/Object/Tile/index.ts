import { SpriteInfo } from '..';
import { IObject } from '../..';

class ITile extends IObject {
  constructor(name: string, spriteInfo: SpriteInfo) {
    super(name, spriteInfo);
  }
}

export default ITile;