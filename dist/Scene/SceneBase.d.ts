import { Application, Container } from 'pixi.js';
export declare type EventType = 'start';
declare class SceneBase extends EventTarget {
    protected app: Application;
    protected name: string;
    protected container: Container;
    constructor(app: Application, name: string);
    addEventListener(type: EventType, callback: () => void): void;
    dispatchEvent(event: CustomEvent): boolean;
    getContainer(): Container<import("pixi.js").DisplayObject>;
    wait(seconds: number): Promise<void>;
}
export default SceneBase;
