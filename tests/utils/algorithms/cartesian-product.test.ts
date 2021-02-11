import { product, productIterator } from "../../../src/utils/algorithms";

const dimension1 = [1, "2"] as const;
const dimension2 = ["3", 4] as const;
const dimension3 = [5, 6, 7] as const;
const params = [dimension1, dimension2, dimension3] as const;
const prod = product(...params);
console.log(prod);
for (const prod of productIterator(...params)) {
  console.log(prod);
}
