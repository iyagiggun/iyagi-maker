export declare type EventType = 'start';
declare class EventableScene extends EventTarget {
    addEventListener(type: EventType, callback: () => void): void;
    dispatchEvent(event: CustomEvent): boolean;
}
export default EventableScene;
