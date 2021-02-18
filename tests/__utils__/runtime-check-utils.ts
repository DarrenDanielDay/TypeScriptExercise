import assert from "assert";
import { AnyArray, Func, TypeGuard } from "../../src/types/util-types";
import { toJson } from "../../src/utils/json/to-json";

export function assertEqual<T>(a: T, b: T) {
  assert.deepStrictEqual(b, a, "assert equal");
}

export function assertThat<U, T extends U>(obj: U, check: TypeGuard<U, T>) {
  if (!check(obj)) {
    assert.fail(
      `Type check failed: ${obj} does not satisfy constraint '${check.name}'`
    );
  }
}

export function assertNotThat<U, T extends U>(obj: U, check: TypeGuard<U, T>) {
  if (check(obj)) {
    assert.fail(`Type check failed: ${obj} satisfy constraint '${check.name}'`);
  }
}

export function assertThrows<Params extends AnyArray>(
  func: Func<Params, unknown>,
  ...args: Params
) {
  assert.throws(
    () => func(...args),
    `${func.name} does not throw with params ${args.map((arg) => toJson(arg))}`
  );
}

export function assertNoException<Params extends AnyArray>(
  func: Func<Params, unknown>,
  ...args: Params
) {
  assert.doesNotThrow(
    () => func(...args),
    `${func.name} does not throw with params ${args.map((arg) => toJson(arg))}`
  );
}
