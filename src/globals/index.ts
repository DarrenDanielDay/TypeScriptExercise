import { autobind } from "core-decorators";
import { Mixins } from "../interfaces";
import { rangeMixin } from "./builtins/range";
@autobind
export class GlobalMixinManager {
  private global: typeof globalThis;
  private injected: boolean = false;
  private keysToInject: Set<string>;
  constructor(public readonly mixin: Mixins.IGlobalMixin) {
    this.global = getGlobal();
    this.keysToInject = new Set(Object.keys(mixin));
  }

  private checkKeys() {
    for (let key of Object.keys(this.global)) {
      if (this.keysToInject.has(key)) {
        throw new Error(`Global variable \`${key}\` has been already assigned`);
      }
    }
  }

  inject() {
    if (this.injected) return;
    this.checkKeys();
    Object.assign(this.global, this.mixin);
    this.injected = true;
  }

  remove() {
    if (!this.injected) return;
    this.keysToInject.forEach((key) => delete this.global[key]);
    this.injected = false;
  }

  async useScoped(callback: () => any) {
    this.inject();
    const result = callback();
    if (result instanceof Promise) {
      await result;
    }
    this.remove();
  }
}

export function getGlobal() {
  const globalObject =
    (typeof window !== "undefined" && window) ||
    (typeof global !== "undefined" && global) ||
    null;
  return globalObject;
}
