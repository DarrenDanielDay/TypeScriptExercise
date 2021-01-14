import { Linq } from "../../extensions";
import { Mixins } from "../../interfaces";
import { makeGlobalMixinManager } from "../../interfaces/mixins";
declare global {
  function range(end: number): Linq.QuerySequence<number>;
  function range(begin: number, end: number): Linq.QuerySequence<number>;
  function range(
    begin: number,
    end: number,
    step: number
  ): Linq.QuerySequence<number>;
}
function* range(a: number, b?: number, c?: number): Iterable<number> {
  const args = [a, b, c].filter((v) => typeof v === "number");
  if (args.length === 1) {
    for (let i = 0; i < a; i++) {
      yield i;
    }
    return;
  }
  if (args.length === 2) {
    for (let i = a; i < b; i++) {
      yield i;
    }
    return;
  }
  if (args.length === 3) {
    if (c > 0) {
      for (let i = a; i < b; i += c) {
        yield i;
      }

      return;
    }
    if (c < 0) {
      for (let i = a; i > b; i += c) {
        yield i;
      }
      return;
    }
  }
  throw new Error("Invalid parameter");
}
export const rangeMixin = makeGlobalMixinManager({
  range(a: number, b?: number, c?: number) {
    return new Linq.QuerySequence(range(a, b, c));
  },
});
