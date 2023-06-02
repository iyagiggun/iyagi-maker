import IObject, { IObjectInfo } from '..';
declare type ICharacterInfo = IObjectInfo & {};
export default class ICharacter extends IObject {
    private motions;
    constructor(name: string, info: ICharacterInfo);
    do(motionName: string): void;
    load(): Promise<void>;
    attack(target: IObject): void;
}
export {};
