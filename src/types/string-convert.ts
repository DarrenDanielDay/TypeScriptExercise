import { PrimitiveTypes } from "./util-types";

export type Concat<A extends string, B extends string> = `${A}${B}`;
export type TripleConcat<
  Head extends string,
  Splitter extends string,
  Tail extends string
> = `${Head}${Splitter}${Tail}`;
export type EmptyString = "";
export type Underline = "_";
export type Hyphen = "-";
export type LowerCases =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
export type UpperCases =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
export type Chars = LowerCases | UpperCases;
export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type UpperToLowerMap = {
  A: "a";
  B: "b";
  C: "c";
  D: "d";
  E: "e";
  F: "f";
  G: "g";
  H: "h";
  I: "i";
  J: "j";
  K: "k";
  L: "l";
  M: "m";
  N: "n";
  O: "o";
  P: "p";
  Q: "q";
  R: "r";
  S: "s";
  T: "t";
  U: "u";
  V: "v";
  W: "w";
  X: "x";
  Y: "y";
  Z: "z";
};
export type LowerToUpperMap = {
  a: "A";
  b: "B";
  c: "C";
  d: "D";
  e: "E";
  f: "F";
  g: "G";
  h: "H";
  i: "I";
  j: "J";
  k: "K";
  l: "L";
  m: "M";
  n: "N";
  o: "O";
  p: "P";
  q: "Q";
  r: "R";
  s: "S";
  t: "T";
  u: "U";
  v: "V";
  w: "W";
  x: "X";
  y: "Y";
  z: "Z";
};
// export type OneCharToLower<Char extends string> = Char extends UpperCases ? UpperToLowerMap[Char] : Char;
export type OneCharToLower<Char extends string> = Uncapitalize<Char>;
// export type ToLower<Str extends string> = Str extends EmptyString ? EmptyString : Concat<OneCharToLower<TakeFirst<Str>>, ToLower<TakeRest<Str>>>
export type ToLower<Str extends string> = Lowercase<Str>;
// export type OneCharToUpper<Char extends string> = Char extends LowerCases ? LowerToUpperMap[Char] : Char;
export type OneCharToUpper<Char extends string> = Capitalize<Char>;
// export type ToUpper<Str extends string> = Str extends EmptyString ? EmptyString : Concat<OneCharToUpper<TakeFirst<Str>>, ToUpper<TakeRest<Str>>>
export type ToUpper<Str extends string> = Uppercase<Str>;
export type TakeFirst<Str extends string> = Str extends Concat<
  infer First,
  string
>
  ? First
  : EmptyString;

export type TakeRest<Str extends string> = Str extends Concat<
  string,
  infer Rest
>
  ? Rest
  : EmptyString;

export type ListChar<Str extends string> = Str extends Concat<
  infer One,
  infer Rest
>
  ? [One, ...ListChar<Rest>]
  : [];
export type CutFirst<Arr extends unknown[]> = Arr extends [
  unknown,
  ...infer Rest
]
  ? Rest
  : [];
export type Join<
  Arr extends string[],
  Delimiter extends string = EmptyString
> = Arr extends []
  ? EmptyString
  : Arr extends [infer T]
  ? T extends string
    ? T
    : never
  : TripleConcat<Arr[0], Delimiter, Join<CutFirst<Arr>, Delimiter>>;

// export type Title<Str extends string> = Concat<ToUpper<TakeFirst<Str>>, TakeRest<Str>>
export type Title<Str extends string> = Capitalize<Str>;
// export type Untitle<Str extends string> = Concat<ToLower<TakeFirst<Str>>, TakeRest<Str>>
export type Untitle<Str extends string> = Uncapitalize<Str>;
export type Split<
  Str extends string,
  Splitter extends string
> = Str extends TripleConcat<infer Head, Splitter, infer Tail>
  ? [Head, ...Split<Tail, Splitter>]
  : [Str];

type TitleMapFn<Result extends string[], Arr extends string[]> = Arr extends [
  string,
  ...infer Rest
]
  ? Rest extends string[]
    ? TitleMapFn<[...Result, Title<Arr[0]>], Rest>
    : never
  : [Result, []];
type TitleMap<Arr extends string[]> = TitleMapFn<[], Arr>[0];

export type PascalCase<Str extends string> = Join<
  TitleMap<SplitFn<[], [], Str>>
>;

type _Expecting<Buffer extends string[]> = Buffer extends []
  ? Chars | Digit
  : Buffer[0] extends Chars
  ? LowerCases
  : Buffer[0] extends Digit
  ? Digit
  : never;

type SplitFn<
  Result extends string[],
  Buffer extends string[],
  Source extends string
> = Source extends EmptyString
  ? Chars | Digit extends _Expecting<Buffer> // Buffer is Empty
    ? Result
    : [...Result, Join<Buffer>]
  : TakeFirst<Source> extends Chars | Digit
  ? TakeFirst<Source> extends _Expecting<Buffer>
    ? SplitFn<Result, [...Buffer, TakeFirst<Source>], TakeRest<Source>>
    : SplitFn<[...Result, Join<Buffer>], [], Source>
  : Chars | Digit extends _Expecting<Buffer> // Buffer is Empty
  ? SplitFn<Result, Buffer, TakeRest<Source>>
  : SplitFn<[...Result, Join<Buffer>], [], TakeRest<Source>>;

export type WordSplit<Str extends string> = SplitFn<[], [], Str>;

export type SnakeCase<Str extends string> = ToLower<
  Join<WordSplit<Str>, Underline>
>;

export type SmallCamelCase<Str extends string> = Concat<
  ToLower<TakeFirst<Str>>,
  TakeRest<PascalCase<Str>>
>;

export type CamelCase<Str extends string> = SmallCamelCase<Str>;

export type KebabCase<Str extends string> = ToLower<
  Join<WordSplit<Str>, Hyphen>
>;

export type TemplateAllowedTypes =
  | string
  | number
  | boolean
  | null
  | undefined
  | bigint;

export type AccessPaths<T> = T extends object
  ? {
      [K in keyof T]: [K, ...AccessPaths<T[K]>];
    }[keyof T]
  : [];

export type StringAccessKeyOf<T> = T extends PrimitiveTypes
  ? never
  : `${Extract<keyof T, TemplateAllowedTypes>}`;

export type StringAccessPaths<T> = T extends object
  ? {
      [K in StringAccessKeyOf<T> & keyof T]: [K, ...StringAccessPaths<T[K]>];
    }[StringAccessKeyOf<T> & keyof T]
  : [];
