export function symbolDescriptorEntries<T>(
  obj: T
): {
  [K in Extract<keyof T, symbol>]: [K, TypedPropertyDescriptor<T[K]>];
}[Extract<keyof T, symbol>][] {
  return Object.getOwnPropertySymbols(obj).map((symbol) => [
    symbol,
    Object.getOwnPropertyDescriptor(obj, symbol)!,
  ]) as never;
}

export function allDescriptorEntries<T>(
  obj: T
): {
  [K in keyof T]: [K, TypedPropertyDescriptor<T[K]>];
}[keyof T][] {
  const entries: unknown[] = Object.entries(
    Object.getOwnPropertyDescriptors(obj)
  );
  entries.push(...symbolDescriptorEntries(obj));
  return entries as never;
}
