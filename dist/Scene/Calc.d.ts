export declare type Coords = number[];
export declare const COORDS_X_IDX = 0;
export declare const COORDS_Y_IDX = 1;
export declare const COORDS_W_IDX = 2;
export declare const COORDS_H_IDX = 3;
export declare const getAcc: (distance: number) => 0 | 1 | 2 | 3;
export declare const isIntersecting: ([x1, y1, width1, height1]: Coords, [x2, y2, width2, height2]: Coords) => boolean;
