import { Mixins } from "../interfaces";
import { rangeMixin } from "./builtins/range";
export function injector(mixins: Mixins.IGlobalMixin[]) {
  const globalObject = getGlobal();
  if (globalObject) {
    mixins.forEach((mixin) => {
      Object.assign(globalObject, mixin.getMixins());
    });
  } else {
    throw new Error("cannot find global object");
  }
}

export function getGlobal() {
  const globalObject =
    (typeof window !== "undefined" && window) ||
    (typeof global !== "undefined" && global) ||
    null;
  return globalObject;
}

export function inject(name: string, value: any) {
  getGlobal()[name] = value;
}
