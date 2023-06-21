import IObject, { IObjectInfo } from '..';
export default class ICharacter<T> extends IObject {
    private status;
    constructor(name: string, info: IObjectInfo, status: T);
    getStatus(): T;
    setStatus(status: T): this;
}
