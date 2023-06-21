export default class ObjectBase extends EventTarget {
  constructor(private name: string) {
    super();
  }

  public getName() {
    return this.name;
  }
}
