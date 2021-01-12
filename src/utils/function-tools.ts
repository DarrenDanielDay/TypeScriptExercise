import { UtilTypes } from "../types";

export const $CurryLevel = Symbol.for("$CurryLevel");

export interface Curry<Params extends any[], Result> {
  <PassedParams extends UtilTypes.TupleSlices<Params>>(
    ...args: PassedParams
  ): Currying<Params, Result, PassedParams>;
  [$CurryLevel]: number;
}

export type Currying<
  Params extends any[],
  Result,
  PassedParams extends UtilTypes.TupleSlices<Params>
> = PassedParams extends Params
  ? Result
  : Params extends [
      ...UtilTypes.MapTupleToPrimitives<PassedParams>,
      ...infer RestParams
    ]
  ? Curry<RestParams, Result>
  : null;

export function currying<
  Params extends any[],
  Result,
  PassedParams extends UtilTypes.TupleSlices<Params>
>(
  func: UtilTypes.Func<Params, Result>,
  ...args: PassedParams
): Currying<Params, Result, PassedParams> {
  if (restCount(func) === args.length) {
    return func(...(args as any)) as any;
  }
  const fn: Curry<any, any> = function (...argument) {
    return func(...([...args, ...argument] as any));
  } as any;
  fn[$CurryLevel] = restCount(func) - args.length;
  return function curry() {
    return currying<any, any, any>(fn, ...arguments);
  } as any;
}

function restCount(fn: Curry<any, any> | UtilTypes.Func<any, any>) {
  return fn[$CurryLevel] ?? fn.length;
}

export function callMethod<
  T,
  K extends UtilTypes.MethodKeys<T>,
  P extends Parameters<T[K]> & Iterable<any>
>(target: T, key: K, ...params: P) {
  const method: UtilTypes.Method<typeof target, P, ReturnType<T[K]>> =
    target[key];
  method.call(target, ...params);
}

export function hubCall<
  T,
  K extends UtilTypes.MethodKeys<T>,
  P extends Parameters<T[K]> & Iterable<any>
>(targets: Iterable<T>, key: K, ...params: P) {
  for (const target of targets) {
    callMethod(target, key, ...params);
  }
}
