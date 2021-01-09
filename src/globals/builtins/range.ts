import { Mixins } from "../../interfaces";

function* range(a: number, b?: number, c?: number): Iterable<number> {
  const args = [a, b, c].filter((v) => typeof v === "number" || isNaN(v));
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
export const rangeMixin: Mixins.IGlobalMixin = {
  getMixins() {
    return {
      range,
    };
  },
};
