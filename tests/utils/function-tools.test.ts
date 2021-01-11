import { Functools } from "../../src/utils";

function fn(a: number, b: string, c: null) {
  return {
    a,
    b,
  };
}
let result = Functools.currying(fn, 1)("", null).a;
result = Functools.currying(fn, 1, "")(null).a;
result = Functools.currying(fn)(1)("")(null).a;
result = Functools.currying(fn)(1)("")(null).a;
Functools.currying(fn)(1)("", null).a;
console.log(Functools.currying(fn));
console.log(Functools.currying(fn)(1));
console.log(Functools.currying(fn)(1, ""));
console.log(Functools.currying(fn)(1, "", null));
