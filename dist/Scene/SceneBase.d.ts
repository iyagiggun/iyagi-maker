import { Application, Container } from 'pixi.js';
export declare type EventType = 'start';
declare class SceneBase extends EventTarget {
    protected name: string;
    protected container: Container;
    protected app: Application | null;
    constructor(name: string);
    protected getApplication(): Application<import("pixi.js").ICanvas>;
    detach(): void;
    attachAt(app: Application): void;
    addEventListener(type: EventType, callback: () => void): void;
    dispatchEvent(event: CustomEvent): boolean;
    wait(seconds: number): Promise<void>;
}
export default SceneBase;
