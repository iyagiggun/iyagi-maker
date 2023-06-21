export default class ObjectBase extends EventTarget {
    private name;
    constructor(name: string);
    getName(): string;
}
