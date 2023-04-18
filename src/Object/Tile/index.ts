import IObject, { IObjectInfo } from '..';

export const I_TILE_SIZE = 32;

export default class ITile extends IObject {
  constructor(name: string, objInfo: IObjectInfo) {
    objInfo.down.coordsList.forEach(([,, w, h]) => {
      if (w !== I_TILE_SIZE || h !== I_TILE_SIZE) {
        throw new Error(`ITile(${name}) size must be 32x32. not ${w}x${h}`);
      }
    });
    super(name, { ...objInfo, passable: objInfo.passable ?? true });
  }
}
