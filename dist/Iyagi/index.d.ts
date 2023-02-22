import IScene from '../Scene';
declare class Iyagi {
    private app;
    private width;
    private height;
    constructor(canvas: HTMLCanvasElement);
    play(scene: IScene): void;
}
export default Iyagi;
