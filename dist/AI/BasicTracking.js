"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IObject_1 = require("../IObject");
const Coordinate_1 = require("../Utils/Coordinate");
const findShortestPos = (attacker, target) => {
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
const IBasicTracking = (scene, tracker, target, onArrived, interval = 250) => {
    let isActing = false;
    setInterval(() => {
        if (isActing) {
            return;
        }
        isActing = true;
        const { distance } = (0, IObject_1.getCoordinateRelationship)(tracker, target);
        if (distance < 10) {
            onArrived === null || onArrived === void 0 ? void 0 : onArrived();
            isActing = false;
            return;
        }
        const dest = findShortestPos(tracker, target);
        scene.moveCharacter(tracker, dest, 3, false).then(() => {
            isActing = false;
        });
    }, interval);
};
exports.default = IBasicTracking;
