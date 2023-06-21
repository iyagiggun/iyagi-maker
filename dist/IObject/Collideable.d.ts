import IObjectBase from './IObjectBase';
declare type Area = [x: number, y: number, width: number, height: number];
export default class Collidable extends IObjectBase {
    private area;
    constructor(name: string, area: Area);
}
export {};
