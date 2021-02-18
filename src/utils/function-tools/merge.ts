import { Internal } from "../..";
import { DeepPartial } from "../../types/util-types";
import { allDescriptorEntries } from "./object";
import { isMutableArray, isNullish, isPrimitive } from "./type-guards";

/**
 * Merge the `patch` into the `dist` object. Only the keys defined in `dist` will be merged.
 * When merging two arrays, the logic is append `patch` to `dist`.
 * `typeof dist` must be `object`.
 * When `patch` is `null` or `undefined`, merge will not be performed.
 * @param dist the target object
 * @param patch the patch object
 */
export function merge<A, B extends DeepPartial<A>>(dist: A, patch: B): A {
  if (isPrimitive(dist))
    return Internal.error("Cannot merge into primitive objects.");
  if (isNullish(patch)) return dist;
  if (isMutableArray(dist)) {
    if (Array.isArray(patch)) {
      dist.push(...patch);
      return dist;
    }
  }
  allDescriptorEntries(dist).forEach(([key, descriptor]) => {
    if (
      descriptor.writable === false ||
      (descriptor.writable === undefined && !descriptor.set)
    )
      return;
    const patchDescriptor = Object.getOwnPropertyDescriptor(patch, key);
    if (patchDescriptor) {
      let propertyToMerge = dist[key];
      const patchToApply = patch[key as never];
      if (!isPrimitive(propertyToMerge)) {
        propertyToMerge = merge(propertyToMerge, patchToApply) as never;
      } else {
        propertyToMerge = patchToApply;
      }
      dist[key] = propertyToMerge;
    }
  });
  return dist;
}
