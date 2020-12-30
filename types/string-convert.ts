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
export type OneCharToLower<Char extends Chars> = Char extends UpperCases
  ? UpperToLowerMap[Char]
  : Char;
export type ToLower<Str extends string> = Str extends Concat<
  infer First,
  infer Rest
>
  ? First extends Chars
    ? Concat<OneCharToLower<First>, ToLower<Rest>>
    : Concat<First, ToLower<Rest>>
  : EmptyString;
export type OneCharToUpper<Char extends Chars> = Char extends LowerCases
  ? LowerToUpperMap[Char]
  : Char;
export type ToUpper<Str extends string> = Str extends Concat<
  infer First,
  infer Rest
>
  ? First extends Chars
    ? Concat<OneCharToUpper<First>, ToUpper<Rest>>
    : Concat<First, ToUpper<Rest>>
  : EmptyString;
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
export type CutFirst<Arr> = Arr extends [any, ...infer Rest] ? Rest : [];
export type Join<
  Arr extends string[],
  Delimiter extends string = EmptyString
> = Arr extends [] | [infer T]
  ? T extends string
    ? T
    : EmptyString
  : TripleConcat<Arr[0], Delimiter, Join<CutFirst<Arr>, Delimiter>>;
export type Title<Str extends string> = Str extends Concat<
  infer First,
  infer Rest
>
  ? First extends Chars
    ? Concat<OneCharToUpper<First>, Rest>
    : EmptyString
  : EmptyString;
export type Split<
  Str extends string,
  Splitter extends string
> = Str extends TripleConcat<infer Head, Splitter, infer Tail>
  ? [Head, ...Split<Tail, Splitter>]
  : [Str];

type SplitByNonCharAndUpperWithTitleConvertFunc<
  Target extends string[],
  Buffer extends string[],
  Source extends string
> = Source extends EmptyString
  ? [[...Target, Title<Join<Buffer>>], [], EmptyString]
  : TakeFirst<Source> extends Chars
  ? TakeFirst<Source> extends UpperCases
    ? Buffer extends []
      ? SplitByNonCharAndUpperWithTitleConvertFunc<
          Target,
          [TakeFirst<Source>],
          TakeRest<Source>
        >
      : SplitByNonCharAndUpperWithTitleConvertFunc<
          [...Target, Title<Join<Buffer>>],
          [],
          Source
        >
    : SplitByNonCharAndUpperWithTitleConvertFunc<
        Target,
        [...Buffer, TakeFirst<Source>],
        TakeRest<Source>
      >
  : SplitByNonCharAndUpperWithTitleConvertFunc<
      [...Target, Title<Join<Buffer>>],
      [],
      TakeRest<Source>
    >;

export type PascalCase<Str extends string> = Join<
  SplitByNonCharAndUpperWithTitleConvertFunc<[], [], Str>[0]
>;

export type SplitByNonCharAndUpperFunc<
  Target extends string[],
  Buffer extends string[],
  Source extends string
> = Source extends EmptyString
  ? [[...Target, Join<Buffer>], [], EmptyString]
  : TakeFirst<Source> extends Chars
  ? TakeFirst<Source> extends UpperCases
    ? Buffer extends []
      ? SplitByNonCharAndUpperFunc<
          Target,
          [TakeFirst<Source>],
          TakeRest<Source>
        >
      : SplitByNonCharAndUpperFunc<[...Target, Join<Buffer>], [], Source>
    : SplitByNonCharAndUpperFunc<
        Target,
        [...Buffer, TakeFirst<Source>],
        TakeRest<Source>
      >
  : SplitByNonCharAndUpperFunc<[...Target, Join<Buffer>], [], TakeRest<Source>>;

export type PascalSplit<Str extends string> = SplitByNonCharAndUpperFunc<
  [],
  [],
  Str
>[0];
export type SnakeCase<Str extends string> = ToLower<
  Join<PascalSplit<Str>, Underline>
>;

export type SmallCamelCase<Str extends string> = Concat<
  ToLower<TakeFirst<Str>>,
  TakeRest<PascalCase<Str>>
>;

export type CamelCase<Str extends string> = SmallCamelCase<Str>;

export type KebabCase<Str extends string> = ToLower<
  Join<PascalSplit<Str>, Hyphen>
>;