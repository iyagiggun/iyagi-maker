"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Coordinate_1 = require("../Utils/Coordinate");
const findShortestAttackPos = (attacker, target) => {
    const attackerPos = attacker.getPos();
    const [tCX, tCY] = target.getPos();
    const tWidth = target.getWidth();
    const tHeight = target.getHeight();
    // 공격 위치 후보군
    const posList = [
        [tCX, tCY + tHeight],
        [tCX, tCY - tHeight],
        [tCX + tWidth, tCY],
        [tCX - tWidth, tCY], // 타겟의 왼쪽
    ];
    const distanceList = posList.map((pos) => (0, Coordinate_1.getDistance)(attackerPos, pos));
    const minDistance = Math.min(...distanceList);
    const shortestPosIdx = distanceList.findIndex((distance) => distance === minDistance);
    return posList[shortestPosIdx];
};
exports.default = {
    run: async (scene, monster, target, interval = 250) => {
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
