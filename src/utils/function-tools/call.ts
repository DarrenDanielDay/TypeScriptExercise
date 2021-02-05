import { UtilTypes } from "../../types";

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
