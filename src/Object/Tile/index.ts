import { SpriteInfo } from '..';
import { IObject } from '../..';

export const TILE_SIZE = 32;

export default class ITile extends IObject {
  constructor(name: string, spriteInfo: SpriteInfo) {
    spriteInfo.down.forEach(([x, y, w, h]) => {
      if (w !== TILE_SIZE || h !== TILE_SIZE) {
        throw new Error(`ITile(${name}) size must be 32x32. not ${w}x${h}`);
      }
    });
    super(name, { ...spriteInfo, passable: spriteInfo.passable ?? true });
  }
}
