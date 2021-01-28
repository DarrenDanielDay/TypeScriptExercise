import { autobind } from "core-decorators";
import { Internal } from "..";
import { Mixins } from "../interfaces";
import { UtilTypes } from "../types";
import { HubSwitch } from "../utils/design-patterns";

// Not very clear global context.
// export type PotentialGlobal = typeof globalThis;

// Concrete global context with a choice.
export type PotentialGlobal = typeof globalThis & (Window | NodeJS.Global);

// Better type inference of this context in mixin, but bad performance on vscode.
// export type IGlobalMixin = Partial<UtilTypes.PropertyPart<PotentialGlobal>> & Partial<UtilTypes.MethodsOf<PotentialGlobal>>

// Best choice.
export type IGlobalMixin = Partial<PotentialGlobal>;

// Original solution:
// export interface IGlobalMixin {
//   [variableName: string]: any
// }

@autobind
export class GlobalMixinManager {
  private global: typeof globalThis;
  private keysToInject: Set<string>;
  constructor(public readonly mixin: Mixins.IGlobalMixin) {
    this.global = getGlobal();
    this.keysToInject = new Set(Object.keys(mixin));
  }

  inject() {
    for (const [variableName, value] of Object.entries(this.mixin)) {
      if (this.keysToInject.has(variableName)) {
        Internal.warn("It seems that you have injected these variables.");
        return;
      }
      if (variableName in this.global) {
        Internal.error(`Variable name '${variableName}' is already used.`);
      }
      (this.global as any)[variableName] = value;
      this.keysToInject.add(variableName);
    }
  }

  remove() {
    this.keysToInject.forEach(
      (variableName) => delete (this.global as any)[variableName]
    );
    this.keysToInject.clear();
  }
}

export function getGlobal() {
  const globalObject =
    (typeof window !== "undefined" && window) ||
    (typeof global !== "undefined" && global) ||
    null;
  return globalObject;
}

export function makeGlobalMixinManager(mixin: IGlobalMixin) {
  return new GlobalMixinManager(mixin);
}

export function useGlobalMixins(mixins: GlobalMixinManager[]) {
  return new HubSwitch(mixins, "inject", "remove", [], []);
}
