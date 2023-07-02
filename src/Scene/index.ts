import SceneController from './SceneController';

type Status = 'idle' | 'talking' | '';

export default class IScene extends SceneController {
  private status: Status = 'idle';
}
