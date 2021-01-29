import { UtilTypes } from "../types";

export function promisefy<T>(obj: T): UtilTypes.Promisefy<T> {
  return Promise.resolve(obj) as never;
}

export function asynchronize<Params extends unknown[], Result>(
  fn: (...args: Params) => Result,
  ...args: Params
): UtilTypes.Promisefy<Result> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = fn.apply(undefined, args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 0);
  }) as never;
}

export function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function sleep(delay: number) {
  await wait(delay * 1000);
}

export const $CurryLevel = Symbol.for("$CurryLevel");

export interface Curry<Params extends unknown[], Result> {
  <PassedParams extends UtilTypes.TupleSlices<Params>>(
    ...args: PassedParams
  ): Currying<Params, Result, PassedParams>;
  [$CurryLevel]: number;
}

export type Currying<
  Params extends unknown[],
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
  Params extends unknown[],
  Result,
  PassedParams extends UtilTypes.TupleSlices<Params>
>(
  func: UtilTypes.Func<Params, Result>,
  ...args: PassedParams
): Currying<Params, Result, PassedParams> {
  if (restCount(func) === args.length) {
    return func(...(args as never)) as never;
  }
  const fn: Curry<unknown[], unknown> = function (...argument: unknown[]) {
    return func(...([...args, ...argument] as never));
  } as never;
  fn[$CurryLevel] = restCount(func) - args.length;
  return function curry() {
    return currying.call(undefined, fn, ...arguments);
  } as never;
}

function restCount(
  fn: Curry<unknown[], unknown> | UtilTypes.Func<unknown[], unknown>
) {
  return (fn as Curry<unknown[], unknown>)[$CurryLevel] ?? fn.length;
}

export function callMethod<
  T,
  K extends UtilTypes.MethodKeys<T>,
  P extends Parameters<T[K]> & Iterable<unknown>
>(target: T, key: K, ...params: P) {
  const method: UtilTypes.Method<typeof target, P, ReturnType<T[K]>> =
    target[key];
  method.call(target, ...params);
}

export function hubCall<
  T,
  K extends UtilTypes.MethodKeys<T>,
  P extends Parameters<T[K]> & Iterable<unknown>
>(targets: Iterable<T>, key: K, ...params: P) {
  for (const target of targets) {
    callMethod(target, key, ...params);
  }
}

export type Pipe<Initial, Fns extends Function[]> = Fns extends [
  infer First,
  ...infer Last
]
  ? First extends (...args: infer P) => infer R
    ? [Initial] extends P
      ? Last extends Function[]
        ? Pipe<R, [...Last]>
        : never
      : never
    : never
  : Initial;

export function pipe<T, Params extends Function[]>(
  init: T,
  ...t: Params
): Pipe<T, Params> {
  let returnValue: unknown = init;
  for (const fn of t) {
    returnValue = fn.call(undefined, returnValue);
  }
  return returnValue as never;
}

export async function pipeAsync<T, Params extends Function[]>(
  init: T,
  ...t: Params
): Promise<Pipe<T, Params>> {
  let returnValue: unknown = init;
  for (const fn of t) {
    returnValue = await asynchronize(fn.bind(undefined, returnValue));
  }
  return returnValue as never;
}
