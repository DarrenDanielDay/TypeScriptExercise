export type ObjectEntry<T, K extends keyof T> = [K, T[K]];
export type ObjectEntries<T> = {
  [K in keyof T]: ObjectEntry<T, K>;
}[keyof T][];
