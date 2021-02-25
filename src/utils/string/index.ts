import { Internal } from "../..";

export function capitalize<Str extends string>(s: Str): Capitalize<Str> {
  return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}` as never;
}

export function unicode(char: string) {
  if (char.length !== 1) {
    return Internal.error("cannot be code");
  }
  return char.charCodeAt(0);
}

export function chr(code: number) {
  return String.fromCharCode(code);
}
