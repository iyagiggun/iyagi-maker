import IObject, { IObjectInfo } from '..';

export default class ICharacter<T> extends IObject {
  private status: T;

  constructor(name: string, info: IObjectInfo, status: T) {
    super(name, info);
    this.status = status;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: T) {
    this.status = status;
    this.dispatchEvent(new CustomEvent('statusChange'));
    return this;
  }
}
