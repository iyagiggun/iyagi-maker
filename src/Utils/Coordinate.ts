export type Coords = number[];

export const COORDS_X_IDX = 0;
export const COORDS_Y_IDX = 1;
export const COORDS_W_IDX = 2;
export const COORDS_H_IDX = 3;

export const getAcc = (distance: number): 0 | 1 | 2 | 3 => {
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

/**
 * 반드시 a1 <= a2 이고, b1 <=  b2 여야함. (이게 맞지 않으면 제대로 체크되지 않음)
 * @return {boolean} 1차원 공간에서 직선 2개가 겹치는지 여부
 */
const isOverlapIn1D = (
  a1: number,
  a2: number,
  b1: number,
  b2: number,
): boolean => {
  if (a2 <= b1 || a1 >= b2) {
    return false;
  }
  return true;
};

export const isIntersecting = (
  [x1, y1, width1, height1]: Coords,
  [x2, y2, width2, height2]: Coords,
) => isOverlapIn1D(
  x1,
  x1 + width1,
  x2,
  x2 + width2,
) && isOverlapIn1D(
  y1,
  y1 + height1,
  y2,
  y2 + height2,
);

export const getDistance = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
