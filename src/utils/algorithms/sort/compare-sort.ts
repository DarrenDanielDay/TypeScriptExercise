import { LinkedQueue } from "../../data-structure";
import { randomInt } from "../math/random";
import { CompareFunc, generalCompare } from "./compare-func";

export function bubbleSort<T>(
  arr: T[],
  compare: CompareFunc<T> = generalCompare
) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      const ai = arr[i]!;
      const aj = arr[j]!;
      if (compare(ai, aj) < 0) {
        arr[i] = aj;
        arr[j] = ai;
      }
    }
  }
}

export function quickSort<T>(
  arr: T[],
  compare: CompareFunc<T> = generalCompare
) {
  const queue = LinkedQueue.create<[number, number]>([0, arr.length]);
  function _quickSort([begin, end]: [number, number]) {
    if (begin >= end) return;
    const flagIndex = randomInt(begin, end);
    const flag = arr[flagIndex]!;
    arr[flagIndex] = arr[begin]!;
    arr[begin] = flag;
    let position = begin + 1,
      lowerTail = begin;
    let temp: T;
    while (position < end) {
      if (compare(arr[position]!, flag) < 0) {
        lowerTail++;
        temp = arr[position]!;
        arr[position] = arr[lowerTail]!;
        arr[lowerTail] = temp;
      }
      position++;
    }
    arr[begin] = arr[lowerTail]!;
    arr[lowerTail] = flag;
    queue.append([begin, lowerTail]);
    queue.append([lowerTail + 1, end]);
  }
  while (!queue.empty) {
    _quickSort(queue.serve());
  }
}
