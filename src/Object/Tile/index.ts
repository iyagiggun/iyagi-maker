import IObject, { IObjectInfo } from '..';

export const I_TILE_SIZE = 32;

export default class ITile extends IObject {
  constructor(name: string, info: IObjectInfo) {
    const [posX, posY] = info.pos || [];
    if (posX === undefined || posY === undefined) {
      throw new Error(`Fail to create ITile(${name}). Invalid pos. [${posX}, ${posY}]`);
    }
    const pos: [number, number, number] = [posX, posY, -Infinity]; // tile 의 높이는 무조건 최 하
    super(name, { ...info, pos, passable: info.passable ?? true });
  }
}
