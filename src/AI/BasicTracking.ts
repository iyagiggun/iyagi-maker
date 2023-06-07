import IObject from '../Object';
import IScene from '../Scene';
import { getDistance } from '../Utils/Coordinate';

const findShortestPos = (attacker: IObject, target: IObject) => {
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

const IBasicTracking = (
  scene: IScene,
  tracker: IObject,
  target: IObject,
  onArrived?: () => void,
  interval = 250,
) => {
  let isActing = false;
  setInterval(() => {
    if (isActing) {
      return;
    }
    isActing = true;
    const { distance } = tracker.getCoordinateRelationship(target);
    if (distance < 10) {
      onArrived?.();
      isActing = false;
      return;
    }
    const dest = findShortestPos(tracker, target);
    scene.moveCharacter(tracker, dest, 3, false).then(() => {
      isActing = false;
    });
  }, interval);
};

export default IBasicTracking;
