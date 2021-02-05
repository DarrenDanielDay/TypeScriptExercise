import { UtilTypes } from "../../types";

export type Product<Sequences extends UtilTypes.AnyArray[]> = _Product<
  [],
  Sequences
>;

type _Product<
  WalkedSeq extends UtilTypes.AnyArray,
  RestSequences extends UtilTypes.AnyArray[]
> = RestSequences extends UtilTypes.EmptyTuple
  ? WalkedSeq
  : RestSequences extends [infer NextSequence, ...infer NextRestSequence]
  ? NextSequence extends UtilTypes.AnyArray
    ? NextRestSequence extends UtilTypes.AnyArray[]
      ? _ProductMap<WalkedSeq, [], NextSequence, NextRestSequence>
      : never
    : never
  : never;

type _ProductMap<
  WalkedSeq extends UtilTypes.AnyArray,
  AccumulatedResult extends UtilTypes.AnyArray,
  RestItems extends UtilTypes.AnyArray,
  RestSequences extends UtilTypes.AnyArray[]
> = RestItems extends UtilTypes.EmptyTuple
  ? AccumulatedResult
  : RestItems extends [infer NextItem, ...infer NextRestItems]
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
        ...[...WalkedSeq, UtilTypes.ArrayItem<RestItems>][]
      ],
      [],
      RestSequences
    >;

export function product<Params extends UtilTypes.AnyArray[]>(
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
  Arrs extends UtilTypes.AnyArray[]
> = Arrs extends UtilTypes.EmptyTuple
  ? UtilTypes.EmptyTuple
  : Arrs extends [infer FirstArr, ...infer RestArr]
  ? FirstArr extends UtilTypes.AnyArray
    ? RestArr extends UtilTypes.AnyArray[]
      ? [UtilTypes.ArrayItem<FirstArr>, ...ProductItem<RestArr>]
      : never
    : never
  : UtilTypes.ArrayItem<Arrs>[];

export function* productIterator<Params extends UtilTypes.AnyArray[]>(
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
