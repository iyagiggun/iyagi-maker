export default class ObjectBase extends EventTarget {
  constructor(protected name: string) {
    super();
  }
}
