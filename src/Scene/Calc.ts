

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
  x1: number,
  y1: number,
  width1: number,
  height1: number,
  x2: number,
  y2: number,
  width2: number,
  height2: number,
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