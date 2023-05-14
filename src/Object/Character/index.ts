import IObject from '..';

export default class ICharacter extends IObject {
  public attack() {
    console.error(`attach ${this.getName()}`);
  }
}
