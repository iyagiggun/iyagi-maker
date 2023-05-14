"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistance = exports.isIntersecting = exports.getAcc = exports.COORDS_H_IDX = exports.COORDS_W_IDX = exports.COORDS_Y_IDX = exports.COORDS_X_IDX = void 0;
exports.COORDS_X_IDX = 0;
exports.COORDS_Y_IDX = 1;
exports.COORDS_W_IDX = 2;
exports.COORDS_H_IDX = 3;
const getAcc = (distance) => {
    if (distance < 24) {
        return 0;
    }
    if (distance < 48) {
        return 1;
    }
    if (distance < 72) {
        return 2;
    }
    return 3;
};
exports.getAcc = getAcc;
/**
 * 반드시 a1 <= a2 이고, b1 <=  b2 여야함. (이게 맞지 않으면 제대로 체크되지 않음)
 * @return {boolean} 1차원 공간에서 직선 2개가 겹치는지 여부
 */
const isOverlapIn1D = (a1, a2, b1, b2) => {
    if (a2 <= b1 || a1 >= b2) {
        return false;
    }
    return true;
};
const isIntersecting = ([x1, y1, width1, height1], [x2, y2, width2, height2]) => isOverlapIn1D(x1, x1 + width1, x2, x2 + width2) && isOverlapIn1D(y1, y1 + height1, y2, y2 + height2);
exports.isIntersecting = isIntersecting;
const getDistance = ([x1, y1], [x2, y2]) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
exports.getDistance = getDistance;
