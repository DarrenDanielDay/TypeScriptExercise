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
//   [variableName: string]: unknown
// }

@autobind
export class GlobalMixinManager {
  protected global!: PotentialGlobal;
  protected injectedKeys!: Set<string>;
  constructor(public readonly mixin: Mixins.IGlobalMixin) {
    const globalObj = getGlobal();
    if (!globalObj) {
      return Internal.error("Cannot find global object.");
    }
    this.global = globalObj;
    this.injectedKeys = new Set();
  }

  inject() {
    for (const [variableName, value] of Object.entries(this.mixin)) {
      if (this.injectedKeys.has(variableName)) {
        Internal.warn("It seems that you have injected these variables.");
        return;
      }
      if (variableName in this.global) {
        Internal.error(`Variable name '${variableName}' is already used.`);
      }
      ((this.global as unknown) as UtilTypes.SaferAny)[variableName] = value;
      this.injectedKeys.add(variableName);
    }
  }

  remove() {
    this.injectedKeys.forEach(
      (variableName) =>
        delete ((this.global as unknown) as UtilTypes.SaferAny)[variableName]
    );
    this.injectedKeys.clear();
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
