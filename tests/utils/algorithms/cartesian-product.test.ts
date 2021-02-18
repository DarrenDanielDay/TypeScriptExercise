import { product, productIterator } from "../../../src/utils/algorithms";
import { assertEqual } from "../../__utils__/runtime-check-utils";

const dimension1 = [1, "2"] as const;
const dimension2 = ["3", 4] as const;
const dimension3 = [5, 6, 7] as const;
const params = [dimension1, dimension2, dimension3] as const;
const prod = product(...params);
assertEqual(prod, [
  [
    [
      [1, "3", 5],
      [1, "3", 6],
      [1, "3", 7],
    ],
    [
      [1, 4, 5],
      [1, 4, 6],
      [1, 4, 7],
    ],
  ],
  [
    [
      ["2", "3", 5],
      ["2", "3", 6],
      ["2", "3", 7],
    ],
    [
      ["2", 4, 5],
      ["2", 4, 6],
      ["2", 4, 7],
    ],
  ],
]);
assertEqual(
  [...productIterator(...params)],
  [
    [1, "3", 5],
    [1, "3", 6],
    [1, "3", 7],
    [1, 4, 5],
    [1, 4, 6],
    [1, 4, 7],
    ["2", "3", 5],
    ["2", "3", 6],
    ["2", "3", 7],
    ["2", 4, 5],
    ["2", 4, 6],
    ["2", 4, 7],
  ]
);
