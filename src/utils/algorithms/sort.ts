import { LinkedQueue } from "../data-structure";
import { randomInt } from "./math/random";

export function bubbleSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      const ai = arr[i]!;
      const aj = arr[j]!;
      if (ai > aj) {
        arr[i] = aj;
        arr[j] = ai;
      }
    }
  }
}

export function quickSort(arr: number[]) {
  const queue = LinkedQueue.create<[number, number]>([0, arr.length]);
  function _quickSort([begin, end]: [number, number]) {
    if (begin >= end) return;
    const flagIndex = randomInt(begin, end);
    const flag = arr[flagIndex]!;
    arr[flagIndex] = arr[begin]!;
    arr[begin] = flag;
    let position = begin + 1,
      lowerTail = begin;
    let temp: number;
    while (position < end) {
      if (arr[position]! < flag) {
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
