import { UtilTypes } from "../../src/types";
import { Compare } from "./test-utils";

export function assertExpressionAssignable<T>(result: T) {}
export function assertThat<T extends true>() {}
export function assertNotThat<T extends false>() {}
export function assertTypeAssignable<T, P>(result: UtilTypes.Superior<T, P>) {}
export function assertCompare<A, B>(result: Compare<A, B>) {}

