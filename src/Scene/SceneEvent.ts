export type EventType = 'start';

class SceneEvent extends EventTarget {
  public addEventListener(type: EventType, callback: () => void) {
    super.addEventListener(type, callback);
  }

  public dispatchEvent(event: CustomEvent) {
    super.dispatchEvent(event);
    return true;
  }
}

export default SceneEvent;
