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

  protected getApplication() {
    if (!this.app) {
      throw new Error(`[scene: ${this.name}] no application.`);
    }
    return this.app;
  }

  public setApplication(app: Application) {
    this.app = app;
    this.app.stage.addChild(this.container);
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
