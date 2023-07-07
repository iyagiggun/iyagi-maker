import { Application, Container } from 'pixi.js';

export type EventType = 'start';

class SceneBase extends EventTarget {
  protected container: Container;

  constructor(protected app: Application, protected name: string) {
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

  public getContainer() {
    return this.container;
  }

  // eslint-disable-next-line class-methods-use-this
  public wait(seconds: number) {
    return new Promise<void>((resolve) => { window.setTimeout(() => resolve(), seconds * 1000); });
  }
}

export default SceneBase;
