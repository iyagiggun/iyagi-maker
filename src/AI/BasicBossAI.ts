import ICharacter from '../Object/Character';
import IScene from '../Scene';

export default {
  run: async (
    scene: IScene,
    boss: ICharacter,
    target: ICharacter,
    interval = 500,
  ) => {
    let isActing = false;
    setInterval(() => {
      if (isActing) {
        return;
      }
      isActing = true;
      const targetPos = target.getPos();
      scene.moveCharacter(boss, targetPos, 3, false).then(() => {
        isActing = false;
      });
    }, interval);
  },
};
