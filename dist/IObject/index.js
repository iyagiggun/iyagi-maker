"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordinateRelationship = exports.getCenterPos = void 0;
const getCenterPos = (target) => {
    const [x, y] = target.getPos();
    return [x + target.getWidth() / 2, y + target.getHeight() / 2];
};
exports.getCenterPos = getCenterPos;
const getCoordinateRelationship = (self, target) => {
    const [x, y] = (0, exports.getCenterPos)(self);
    const halfWidth = self.getWidth() / 2;
    const halfHeight = self.getHeight() / 2;
    const [tx, ty] = (0, exports.getCenterPos)(target);
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
exports.getCoordinateRelationship = getCoordinateRelationship;
