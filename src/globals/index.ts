import { Mixins } from "../interfaces";
import { rangeMixin } from "./builtins/range";
export function injector(mixins: Mixins.IGlobalMixin[]) {
  const globalObject = getGlobal();
  mixins.forEach((mixin) => {
    Object.assign(globalObject, mixin.getMixins());
  });
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
