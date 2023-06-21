import { Container } from 'pixi.js';
export declare type Pos = [x: number, y: number];
export declare type Area = [x: number, y: number, width: number, height: number];
export declare const getCenterPos: (target: IObjectInterface) => Pos;
export declare const getCoordinateRelationship: (self: IObjectInterface, target: IObjectInterface) => {
    distance: number;
    xDiff: number;
    yDiff: number;
};
export interface IObjectInterface extends Container {
    reaction?: () => Promise<void>;
    load: () => Promise<void>;
    isLoaded: () => boolean;
    getCollisionMod: () => Area;
    getCollisionArea: () => Area;
    getWidth: () => number;
    getHeight: () => number;
    getZIndex: () => number;
    setZIndex: (zIndex?: number) => this;
    getPos: () => Pos;
    setPos: (pos: Pos) => this;
    isAnimation: () => boolean;
    play: () => this;
    stop: () => this;
}
