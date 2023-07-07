import SceneController from './SceneController';

type Status = 'idle' | 'talking' | '';

export default class Scene extends SceneController {
  private status: Status = 'idle';
}
