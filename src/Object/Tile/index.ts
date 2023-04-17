import IObject, { IObjectInfo } from '..';

export const TILE_SIZE = 32;

export default class ITile extends IObject {
  constructor(name: string, objInfo: IObjectInfo) {
    objInfo.down.coordsList.forEach(([,, w, h]) => {
      if (w !== TILE_SIZE || h !== TILE_SIZE) {
        throw new Error(`ITile(${name}) size must be 32x32. not ${w}x${h}`);
      }
    });
    super(name, { ...objInfo, passable: objInfo.passable ?? true });
  }
}
