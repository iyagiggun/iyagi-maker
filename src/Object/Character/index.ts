import IObject from '..';

export default class ICharacter extends IObject {
  private motions: { [key: string]: ICharacter } = {};
}
