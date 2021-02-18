import { Functools } from "../../src/utils";
import { RuntimeCheck } from "../__utils__";
import { isFunction } from "../../src/utils/function-tools/type-guards";
import { assertEqual } from "../__utils__/runtime-check-utils";
function fn(a: number, b: string, c: null) {
  return {
    a,
    b,
    c,
  };
}
let result = Functools.currying(fn, 1)("", null).a;
result = Functools.currying(fn, 1, "")(null).a;
result = Functools.currying(fn)(1)("")(null).a;
result = Functools.currying(fn)(1)("")(null).a;
result.toString();
Functools.currying(fn)(1)("", null).a;
RuntimeCheck.assertThat(Functools.currying(fn) as unknown, isFunction);
RuntimeCheck.assertThat(Functools.currying(fn)(1) as unknown, isFunction);
RuntimeCheck.assertThat(Functools.currying(fn)(1, "") as unknown, isFunction);
RuntimeCheck.assertNotThat(
  Functools.currying(fn)(1, "", null) as unknown,
  isFunction
);
const obj = {
  a() {},
  b(n: number) {
    return n;
  },
  c: 1,
};
Functools.hubCall([obj, obj, obj], "a");
Functools.hubCall([obj, obj, obj], "b", 123);

Functools.pipe(
  1,
  (a: number) => a.toFixed(2),
  (s: string) => s.split("."),
  (arr: unknown[]) => arr.length
).toFixed();

export async function main() {
  return Functools.pipeAsync(
    1,
    (a: number) => a.toFixed(2),
    (s: string) => s.split("."),
    (arr: unknown[]) => arr.length
  ).then((value) => {
    assertEqual(value, 2);
  });
}
