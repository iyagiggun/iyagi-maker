import Obj from '../Obj';
import SceneObjectManager from './SceneObjectManager';

export default class SceneCamera extends SceneObjectManager {
  protected getCameraPos(target: Obj) {
    if (!this.objectList.includes(target)) {
      throw new Error(`Fail to focus. ${target.getName()}. no the target in scene "${this.name}".`);
    }
    const [targetCenterX, targetCenterY] = target.getCenterPos();
    const { width: appWidth, height: appHeight } = this.app.view;
    const destX = Math.round((appWidth / 2) - targetCenterX);
    const destY = Math.round((appHeight / 2) - targetCenterY);
    return [destX, destY];
  }

  public async moveCamera(target: Obj, speed = Infinity) {
    return new Promise<void>((resolve) => {
      const [destX, destY] = this.getCameraPos(target);
      const cameraSpeed = speed * 2;

      const { ticker } = this.app;
      const tick = () => {
        const curX = this.container.x;
        const curY = this.container.y;
        const diffX = destX - curX;
        const diffY = destY - curY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
        const arrived = distance < cameraSpeed;
        if (arrived) {
          this.container.x = destX;
          this.container.y = destY;
          ticker.remove(tick);
          resolve();
        } else {
          const deltaX = cameraSpeed * (diffX / distance);
          const deltaY = cameraSpeed * (diffY / distance);
          this.container.x += Math.round(deltaX);
          this.container.y += Math.round(deltaY);
        }
      };
      ticker.add(tick);
    });
  }
}
