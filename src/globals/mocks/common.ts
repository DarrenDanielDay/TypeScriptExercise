import {
  getGlobal,
  GlobalMixinManager,
  IGlobalMixin,
  PotentialGlobal,
} from "../../interfaces/mixins";
import { SaferAny } from "../../types/util-types";
import { HubSwitch } from "../../utils/design-patterns";
import { clone } from "../../utils/function-tools/clone";

export const GLOBAL_MIRROR = clone(getGlobal(), { overwrite: true })!;

export class GlobalObjectMock extends GlobalMixinManager {
  protected removedEntries: Map<keyof PotentialGlobal, unknown> = new Map();
  inject() {
    const globalObj = (this.global as unknown) as SaferAny;
    (GLOBAL_MIRROR.Object.keys(
      this.mixin
    ) as (keyof PotentialGlobal)[]).forEach((key) => {
      const value = globalObj[key];
      delete globalObj[key] && this.removedEntries.set(key, value);
    });
    super.inject();
  }

  remove() {
    super.remove();
    const globalObj = this.global;
    this.removedEntries.forEach(
      (value, key) => (globalObj[key as "Object"] = value as typeof Object)
    );
    this.removedEntries.clear();
  }
}

export function createMock(mock: IGlobalMixin) {
  return new GlobalObjectMock(mock);
}

export function useMocks(mixins: GlobalMixinManager[]) {
  return new HubSwitch(mixins, "inject", "remove", [], []);
}
