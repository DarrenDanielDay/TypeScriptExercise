import { clone } from "../../../src/utils/function-tools/clone";
import { assertEqual } from "../../__utils__/runtime-check-utils";

const original = { a: 1, b: 2 };
const added = Object.assign(original, { c: original, d: [original] });
assertEqual(original, added);
const cloned = clone(added);
assertEqual(cloned, cloned.c);
assertEqual(cloned, cloned.d[0]);
assertEqual(cloned, original);
assertEqual(Object.is(cloned, original), false);
assertEqual(cloned === original, false);
