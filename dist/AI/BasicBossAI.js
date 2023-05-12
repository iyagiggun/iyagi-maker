"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    run: async (scene, boss, target, interval = 500) => {
        let isActing = false;
        setInterval(() => {
            if (isActing) {
                return;
            }
            isActing = true;
            const targetPos = target.getPos();
            scene.moveCharacter(boss, targetPos, 3, false).then(() => {
                isActing = false;
            });
        }, interval);
    },
};
