import IObject from '../Object';
import ICharacter from '../Object/Character';
import IScene from '../Scene';
import { getDistance } from '../Utils/Coordinate';

const findShortestAttackPos = (attacker: IObject, target: IObject) => {
  const attackerPos = attacker.getPos();
  const [tCX, tCY] = target.getPos();
  const tWidth = target.getWidth();
  const tHeight = target.getHeight();

  // 공격 위치 후보군
  const posList: [number, number][] = [
    [tCX, tCY + tHeight], // 타겟의 위
    [tCX, tCY - tHeight], // 타겟의 아래
    [tCX + tWidth, tCY], // 타겟의 오른쪽
    [tCX - tWidth, tCY], // 타겟의 왼쪽
  ];

  const distanceList = posList.map((pos) => getDistance(attackerPos, pos));
  const minDistance = Math.min(...distanceList);
  const shortestPosIdx = distanceList.findIndex((distance) => distance === minDistance);

  return posList[shortestPosIdx];
};

export default {
  run: async (
    scene: IScene,
    monster: ICharacter,
    target: ICharacter,
    interval = 250,
  ) => {
    let isActing = false;
    setInterval(() => {
      if (isActing) {
        return;
      }
      isActing = true;
      const { distance } = monster.getCoordinateRelationship(target);
      if (distance < 10) {
        monster.attack();
        isActing = false;
        return;
      }
      const attackPos = findShortestAttackPos(monster, target);
      scene.moveCharacter(monster, attackPos, 3, false).then(() => {
        isActing = false;
      });
    }, interval);
  },
};
