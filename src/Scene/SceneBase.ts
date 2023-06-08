import { Application, Container } from 'pixi.js';

export type EventType = 'start';

class SceneBase extends EventTarget {
  protected container: Container;

  protected app: Application | null = null;

  constructor(protected name: string) {
    super();
    this.container = new Container();
    this.container.sortableChildren = true;
  }

  protected getApplication() {
    if (!this.app) {
      throw new Error(`[scene: ${this.name}] no application.`);
    }
    return this.app;
  }

  public detach() {
    this.getApplication().stage.removeChild(this.container);
    this.app = null;
  }

  public attachAt(app: Application) {
    app.stage.addChild(this.container);
    this.app = app;
  }

  public addEventListener(type: EventType, callback: () => void) {
    super.addEventListener(type, callback);
  }

  public dispatchEvent(event: CustomEvent) {
    super.dispatchEvent(event);
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  public wait(seconds: number) {
    return new Promise<void>((resolve) => { window.setTimeout(() => resolve(), seconds * 1000); });
  }
}

export default SceneBase;
