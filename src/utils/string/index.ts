export function capitalize<Str extends string>(s: Str): Capitalize<Str> {
  return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}` as never;
}
