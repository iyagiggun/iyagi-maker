import IObject from '../Object';
import SceneController from './SceneController';

type Status = 'idle' | 'talking' | '';

export default class IScene extends SceneController {
  private status: Status = 'idle';

  public drawMap() {
    // add object
    this.objectList.forEach((obj) => {
      obj.attachAt(this.container);
    });
  }

  public moveCharacter(
    target: IObject,
    [destX, destY]: [number, number],
    speed: number,
    chaseCamera: boolean,
  ) {
    return new Promise<void>((resolve) => {
      if (target.isDoing()) {
        resolve();
        return;
      }
      const { ticker } = this.getApplication();

      const tick = () => {
        const [curX, curY] = target.getPos();
        const diffX = destX - curX;
        const diffY = destY - curY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
        let arrived = distance < speed;

        if (arrived) {
          target.setPos(destX, destY);
          target.stop();
        } else {
          const deltaX = speed * (diffX / distance);
          const deltaY = speed * (diffY / distance);
          const nextX = this.getObjectNextX(target, deltaX);
          const nextY = this.getObjectNextY(target, deltaY);
          target.setPos(nextX, nextY);
          target.changeDirection(deltaX, deltaY);
          target.play(speed);
          if (curX === nextX && curY === nextY) {
            arrived = true;
          }
        }

        if (chaseCamera) {
          const [cameraX, cameraY] = this.getCameraPos(target);
          this.container.x = cameraX;
          this.container.y = cameraY;
        }

        if (arrived) {
          ticker.remove(tick);
          target.stop();
          resolve();
        }
      };
      target.play(speed);
      ticker.add(tick);
    });
  }
}
