import { IObjectInfo } from '..';
import { IObject } from '../..';

export default class ICharacter extends IObject {
  constructor(name: string, objInfo: IObjectInfo) {
    super(name, objInfo);
  }
}