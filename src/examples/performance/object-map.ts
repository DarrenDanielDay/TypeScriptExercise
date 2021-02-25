import { randomChar } from "../../utils/algorithms/math/random";
import { timer } from "../../utils/time";

function randomStringKey(length: number) {
  const result: string[] = [];
  for (let i = 0; i < length; i++) {
    result.push(randomChar("both"));
  }
  return result.join("");
}

const pairs: [string, string][] = [];

for (let i = 0; i < 5000000; i++) {
  pairs.push([randomStringKey(16), randomStringKey(3)]);
}
const obj: Record<string, string> = {};
const map: Map<string, string> = new Map<string, string>();

timer("obj[key] = value", () => {
  for (const [key, value] of pairs) {
    obj[key] = value;
  }
});

timer("Map.set(key, value)", () => {
  for (const [key, value] of pairs) {
    map.set(key, value);
  }
});
const objKeySet = new Set<string>();
timer("obj[key]", () => {
  for (const [key] of pairs) {
    objKeySet.add(obj[key]!);
  }
});
const mapKeySet = new Set<string>();
timer("Map.get(key)", () => {
  for (const [key] of pairs) {
    mapKeySet.add(map.get(key)!);
  }
});

console.assert(
  mapKeySet.size === objKeySet.size &&
    [...mapKeySet].every((key) => objKeySet.has(key))
);

timer("delete obj[key]", () => {
  for (const [key] of pairs) {
    delete obj[key];
  }
});

timer("Map.delete(key)", () => {
  for (const [key] of pairs) {
    map.delete(key);
  }
});
