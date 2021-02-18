import { Internal } from "../..";
import {
  isGeneralObject,
  isSymbol,
  isTypicalObject,
} from "../function-tools/type-guards";
import { isJSONPrimitive } from "./json-schema";

export function toJson(
  obj: unknown,
  options?: { addCircular?: boolean; symbolWriter?: (symbol: symbol) => string }
): string {
  const { addCircular, symbolWriter } = options || {};
  const set = new Set();
  function _toJson(o: unknown): string {
    if (isJSONPrimitive(o)) {
      return JSON.stringify(o) ?? "null";
    }
    if (Array.isArray(o)) {
      if (set.has(o)) {
        if (addCircular) return `"[Circular array:length ${o.length}]"`;
        return "null";
      }
      set.add(o);
      return `[${o.map(_toJson).join(",")}]`;
    }
    if (!isGeneralObject(o))
      return Internal.error("Cannot convert to JSON:", o);
    if (set.has(o)) {
      if (addCircular) return `{$circular: ${JSON.stringify(Object.keys(o))}}`;
      return "null";
    }
    set.add(o);
    if (!isTypicalObject(o)) {
      if (!symbolWriter)
        return Internal.error(
          "If you want to convert object with symbol keys to JSON, `symbolWriter` is required."
        );
      return `{${Object.entries(Object.getOwnPropertyDescriptors(o))
        .map(
          ([key, value]: [string | symbol, unknown]) =>
            `"${isSymbol(key) ? symbolWriter(key) : key}":${_toJson(value)}`
        )
        .join(",")}}`;
    }
    return `{${Object.entries(o)
      .map(([key, value]) => `"${key}":${_toJson(value)}`)
      .join(",")}}`;
  }
  return _toJson(obj);
}
