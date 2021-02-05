import {
  Func,
  MapTupleToPrimitives,
  TupleSlices,
} from "../../types/util-types";

export const $CurryLevel = Symbol.for("$CurryLevel");

export interface Curry<Params extends unknown[], Result> {
  <PassedParams extends TupleSlices<Params>>(...args: PassedParams): Currying<
    Params,
    Result,
    PassedParams
  >;
  [$CurryLevel]: number;
}

export type Currying<
  Params extends unknown[],
  Result,
  PassedParams extends TupleSlices<Params>
> = PassedParams extends Params
  ? Result
  : Params extends [...MapTupleToPrimitives<PassedParams>, ...infer RestParams]
  ? Curry<RestParams, Result>
  : null;

export function currying<
  Params extends unknown[],
  Result,
  PassedParams extends TupleSlices<Params>
>(
  func: Func<Params, Result>,
  ...args: PassedParams
): Currying<Params, Result, PassedParams> {
  if (restCount(func as never) === args.length) {
    return func(...(args as never)) as never;
  }
  const fn: Curry<unknown[], unknown> = function (...argument: unknown[]) {
    return func(...([...args, ...argument] as never));
  } as never;
  fn[$CurryLevel] = restCount(func as never) - args.length;
  return function curry() {
    return currying.call(undefined, fn, ...((arguments as unknown) as []));
  } as never;
}

function restCount(fn: Curry<unknown[], unknown> | Func<unknown[], unknown>) {
  return (fn as Curry<unknown[], unknown>)[$CurryLevel] ?? fn.length;
}
