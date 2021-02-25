import { Internal } from "../../..";
import { unicode } from "../../string";

/**
 * Random integer in [low, high)
 * @param low lower bound
 * @param high higher bound
 */
export function randomInt(low: number, high: number) {
  return Math.floor(low + Math.random() * (high - low));
}

/**
 * Generate a random charactor in [A-Z]|[a-z].
 * @param cases character case
 */
export function randomChar(cases: "upper" | "lower" | "both" = "lower") {
  const offset = randomInt(0, 26);
  if (cases === "lower") return String.fromCharCode(unicode("a") + offset);
  if (cases === "upper") return String.fromCharCode(unicode("A") + offset);
  if (cases === "both")
    return Math.random() < 0.5
      ? String.fromCharCode(unicode("a") + offset)
      : String.fromCharCode(unicode("A") + offset);
  return Internal.fatal("Cases for random char must be `upper` or `lower`!");
}
