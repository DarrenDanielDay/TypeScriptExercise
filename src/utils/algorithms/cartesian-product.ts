import {
  AnyArray,
  EmptyTuple,
  ArrayItem,
  TupleTail,
} from "../../types/util-types";

export type Product<Sequences extends readonly AnyArray[]> = _Product<
  [],
  Sequences
>;

type _Product<
  WalkedSeq extends AnyArray,
  RestSequences extends readonly AnyArray[]
> = RestSequences extends EmptyTuple
  ? WalkedSeq
  : RestSequences extends readonly [
      infer NextSequence,
      ...infer NextRestSequence
    ]
  ? NextSequence extends AnyArray
    ? NextRestSequence extends readonly AnyArray[]
      ? _ProductMap<WalkedSeq, [], NextSequence, NextRestSequence>
      : never
    : never
  : never;

type _ProductMap<
  WalkedSeq extends AnyArray,
  AccumulatedResult extends AnyArray,
  RestItems extends AnyArray,
  RestSequences extends readonly AnyArray[]
> = RestItems extends EmptyTuple
  ? AccumulatedResult
  : RestItems extends readonly [infer NextItem, ...infer NextRestItems]
  ? _ProductMap<
      WalkedSeq,
      [...AccumulatedResult, _Product<[...WalkedSeq, NextItem], RestSequences>],
      NextRestItems,
      RestSequences
    >
  : _ProductMap<
      WalkedSeq,
      [
        ...AccumulatedResult,
        ..._Product<[...WalkedSeq, ArrayItem<RestItems>], RestSequences>[]
      ],
      [],
      RestSequences
    >;

export type KeyBasedProduct<
  Sequences extends readonly AnyArray[]
> = _KeyProduct<[], Sequences[0], TupleTail<Sequences>>;

type _KeyProduct<
  Item extends AnyArray,
  NextSequence,
  RestSequences extends AnyArray
> = {
  [K in keyof NextSequence]: RestSequences extends EmptyTuple
    ? [...Item, NextSequence[K]]
    : _KeyProduct<
        [...Item, NextSequence[K]],
        RestSequences[0],
        TupleTail<RestSequences>
      >;
};

export function product<Params extends AnyArray[]>(
  ...args: Params
): Product<Params> {
  const walkedSeq: unknown[] = [];
  function _product() {
    if (walkedSeq.length === args.length) {
      const node = [...walkedSeq];
      return node;
    }
    return (args[walkedSeq.length] as unknown[]).map((value) => {
      walkedSeq.push(value);
      const childNode: unknown = _product();
      walkedSeq.pop();
      return childNode;
    });
  }
  return _product() as never;
}
export type ProductItem<
  Arrs extends readonly AnyArray[]
> = Arrs extends EmptyTuple
  ? EmptyTuple
  : Arrs extends readonly [infer FirstArr, ...infer RestArr]
  ? FirstArr extends AnyArray
    ? RestArr extends readonly AnyArray[]
      ? [ArrayItem<FirstArr>, ...ProductItem<RestArr>]
      : never
    : never
  : ArrayItem<Arrs>[];

export function* productIterator<Params extends readonly AnyArray[]>(
  ...args: Params
): Generator<ProductItem<Params>, void, void> {
  if (!args.length || args.some((arg) => arg.length === 0)) return;
  const walkedSeq: number[] = [0];
  while (walkedSeq[0]! < args[0]!.length) {
    const level = walkedSeq.length - 1;
    if (walkedSeq[level] === (args[level]?.length ?? 0)) {
      walkedSeq.pop();
      walkedSeq[level - 1]++;
      continue;
    }
    if (level === args.length - 1) {
      yield args.map((seq, i) => seq[walkedSeq[i]!]) as never;
    }
    walkedSeq.push(0);
  }
}
