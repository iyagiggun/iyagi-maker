import IScene from '.';


export type ISceneEventType = 'start';

export default class ISceneEvent extends CustomEvent<IScene> {
  constructor(type: ISceneEventType) {
    super(type);
  }
}