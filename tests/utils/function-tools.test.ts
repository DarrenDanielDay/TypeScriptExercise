import { Functools } from "../../src/utils";
import { Internal } from "../../src";
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
console.log(Functools.currying(fn));
console.log(Functools.currying(fn)(1));
console.log(Functools.currying(fn)(1, ""));
console.log(Functools.currying(fn)(1, "", null));
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

Functools.pipeAsync(
  1,
  (a: number) => a.toFixed(2),
  (s: string) => s.split("."),
  (arr: unknown[]) => arr.length
).then((value) => {
  Internal.info("value", value);
});
