"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
class ICharacter extends __1.default {
    constructor(name, info, status) {
        super(name, info);
        this.status = status;
    }
    getStatus() {
        return this.status;
    }
    setStatus(status) {
        this.status = status;
        // this.dispatchEvent(new CustomEvent('statusChange'));
        return this;
    }
}
exports.default = ICharacter;
