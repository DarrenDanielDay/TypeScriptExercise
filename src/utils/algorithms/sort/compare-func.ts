export type CompareFunc<T> = (a: T, b: T) => number;

export const numberCompare: CompareFunc<number> = (a, b) => a - b;
export const generalCompare: CompareFunc<unknown> = (a, b) =>
  (a as number) < (b as number) ? -1 : (a as number) > (b as number) ? 1 : 0;
export const stringCompare: CompareFunc<string> = generalCompare;
export const numberStringCompare: CompareFunc<string> = (a, b) => {
  const regexp = /(.*?)(\d+)/y;
  let r: NonNullable<ReturnType<typeof regexp["exec"]>>;
  function split(str: string) {
    const result: [string, number][] = [];
    let lastEnd = 0;
    while ((r = regexp.exec(str)!)) {
      const [total, word, digits] = r;
      lastEnd = r.index + total!.length;
      if (word && digits) {
        result.push([word, parseInt(digits)]);
      }
    }
    const rest = str.slice(lastEnd);
    if (rest) result.push([rest, -1]);
    return result;
  }
  const aList = split(a);
  const bList = split(b);
  for (let i = 0; i < aList.length && i < bList.length; i++) {
    const [aWord, aNumber] = aList[i]!;
    const [bWord, bNumber] = bList[i]!;
    if (aWord !== bWord) {
      return stringCompare(aWord, bWord);
    }
    if (aNumber !== bNumber) {
      return numberCompare(aNumber, bNumber);
    }
  }
  return 0;
};
