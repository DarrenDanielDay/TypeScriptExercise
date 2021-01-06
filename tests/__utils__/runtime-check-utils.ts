import assert from "assert";

export function assertEqual<T>(a: T, b: T) {
  assert.deepStrictEqual(b, a, "assert equal");
}
