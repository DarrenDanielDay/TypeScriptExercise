import { randomInt } from "../../utils/algorithms/math/random";
import { bubbleSort, quickSort } from "../../utils/algorithms/sort";
import { timer } from "../../utils/time";

const array: number[] = [];
for (let i = 0; i < 100000; i++) {
  array.push(randomInt(1, 100));
}

const arr1 = array.concat();
const arr2 = array.concat();
timer("quick sort", () => {
  quickSort(arr2);
});
timer("bubble sort", () => {
  bubbleSort(arr1);
});

array
  .sort((a, b) => a - b)
  .forEach((v, i) => {
    console.assert(arr1[i] === v && arr2[i] === v);
  });
