import { Internal } from "../..";
import { DeepPartial } from "../../types/util-types";
import { merge } from "./merge";
import { symbolDescriptorEntries } from "./object";
import { isFunction, isGeneralObject, isPrimitive } from "./type-guards";
export interface CloneOptions {
  deep: boolean;
  overwrite: boolean;
  overwriteConfigs: {
    configuable: boolean;
    enumerable: boolean;
    writeable: boolean;
    getValue: boolean;
  };
  include: {
    symbolProps: boolean;
    notEnumerableProps: boolean;
    prototype: boolean;
    getter: boolean;
    setter: boolean;
  };
}
const getDefaultConfig = (): CloneOptions => ({
  deep: true,
  overwrite: false,
  overwriteConfigs: {
    configuable: true,
    enumerable: true,
    writeable: true,
    getValue: true,
  },
  include: {
    symbolProps: true,
    notEnumerableProps: true,
    prototype: true,
    getter: true,
    setter: true,
  },
});
export function clone<T>(obj: T, options?: DeepPartial<CloneOptions>): T {
  const mergedOptions = merge(getDefaultConfig(), options || {});
  const { deep, include, overwriteConfigs, overwrite } = mergedOptions;
  const {
    symbolProps,
    notEnumerableProps,
    prototype,
    getter,
    setter,
  } = include;
  const { configuable, enumerable, writeable, getValue } = overwriteConfigs;
  const clonedMapping = new Map();
  function _create<T>(o: T): T {
    let result: T;
    if (Array.isArray(o)) {
      result = (new Array() as unknown) as T;
    } else if (isGeneralObject(o)) {
      result = Object.create(null);
    } else if (isFunction(o)) {
      result = function (this: unknown) {
        return o.apply(this, arguments);
      } as never;
    } else {
      return Internal.error("Unsupported object:", o);
    }
    clonedMapping.set(o, result);
    return result;
  }

  function _clone(o: unknown, isInner: boolean): unknown {
    if (isPrimitive(o)) {
      return o;
    }
    if (!deep && isInner) return o;
    if (clonedMapping.has(o)) return clonedMapping.get(o);
    const result = _create(o);
    const descriptors = Object.getOwnPropertyDescriptors(o);
    const entries: [string | symbol, PropertyDescriptor][] = Object.entries(
      descriptors
    );
    if (symbolProps) {
      entries.push(...symbolDescriptorEntries(o));
    }
    for (const [key, descriptor] of entries) {
      if (!notEnumerableProps && !descriptor.enumerable) continue;
      const newDescriptor: PropertyDescriptor = {};
      let clonedValue: unknown;
      let needSet = false;
      try {
        clonedValue = _clone((o as never)[key], true);
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e;
        }
        clonedValue = undefined;
      }
      if (overwrite) {
        // overwrite common descriptor configs.
        newDescriptor.configurable = configuable;
        newDescriptor.enumerable = enumerable;
        // When `getValue` is true, the getters and setters will be discarded.
        // Only the current apparent value will be cloned.
        if (getValue || !(descriptor.get || descriptor.set)) {
          newDescriptor.value = clonedValue;
          newDescriptor.writable = writeable;
        } else {
          // When getter or setter in the descriptor is specified,
          // `getter` and `setter` options will determine whether
          // the getter and setter will be preserved.
          getter && descriptor.get && (newDescriptor.get = descriptor.get);
          setter && descriptor.set && (newDescriptor.set = descriptor.set);
          needSet = true;
        }
      } else {
        // When no overwrite, just use the descriptor.
        // And the value will be set by the cloned one after defineProperty.
        Object.assign(newDescriptor, descriptor);
        needSet = true;
      }
      Object.defineProperty(result, key, newDescriptor);
      try {
        needSet && ((result as never)[key] = clonedValue as never);
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e;
        }
      }
    }
    if (prototype) {
      Object.setPrototypeOf(result, Object.getPrototypeOf(o));
    }
    return result;
  }
  return _clone(obj, false) as T;
}
