import { Application, Container } from 'pixi.js';

export type EventType = 'start';

class SceneBase extends EventTarget {
  protected container: Container;

  protected app?: Application;

  constructor(protected name: string) {
    super();
    this.container = new Container();
    this.container.sortableChildren = true;
  }

  public addEventListener(type: EventType, callback: () => void) {
    super.addEventListener(type, callback);
  }

  public dispatchEvent(event: CustomEvent) {
    super.dispatchEvent(event);
    return true;
  }
}

export default SceneBase;
