import IObject from '../IObject';
import ICharacter from '../IObject/ICharacter';
import IScene from '../Scene';
import { getDistance } from '../Utils/Coordinate';

export const getCoordinateRelationship = (self: IObject, target: IObject) => {
  const [x, y] = self.getCenterPos();
  const halfWidth = self.getWidth() / 2;
  const halfHeight = self.getHeight() / 2;
  const [tx, ty] = target.getCenterPos();
  const tHalfWidth = target.getWidth() / 2;
  const tHalfHeight = target.getHeight() / 2;

  const xDiff = tx - x;
  const yDiff = ty - y;

  // y 축이 동일하면 삼각함수 못씀
  if (xDiff === 0) {
    const distance = Math.abs(yDiff - halfHeight - tHalfHeight);
    return {
      distance, xDiff, yDiff,
    };
  }
  // x 축이 동일하면 삼각함수 못씀
  if (yDiff === 0) {
    const distance = Math.abs(xDiff - halfWidth - tHalfWidth);
    return {
      distance, xDiff, yDiff,
    };
  }

  // 중심점 간 거리
  const cDistance = Math.sqrt(xDiff ** 2 + yDiff ** 2);
  // x 축으로 겹쳐 있다면 sin 으로 구해야 함.
  if (xDiff < halfWidth + tHalfWidth) {
    const arcSin = Math.abs(cDistance / yDiff);
    const distance = cDistance - arcSin * halfHeight - arcSin * tHalfHeight;
    return {
      distance, xDiff, yDiff,
    };
  }
  // y축으로 겹쳐있거나 나머지의 경우는 cos 으로 구함.
  const arcCos = Math.abs(cDistance / xDiff);
  const distance = cDistance - arcCos * halfWidth - arcCos * tHalfWidth;
  return {
    distance, xDiff, yDiff,
  };
};

const findShortestPos = (attacker: ICharacter, target: ICharacter) => {
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
  tracker: ICharacter,
  target: ICharacter,
  onArrived?: () => void,
  interval = 250,
) => {
  let isActing = false;
  setInterval(() => {
    if (isActing) {
      return;
    }
    isActing = true;
    const { distance } = getCoordinateRelationship(tracker, target);
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
