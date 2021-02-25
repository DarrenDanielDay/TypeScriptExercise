import { numberStringCompare } from "../../../../src/utils/algorithms/sort/compare-func";
import { assertEqual } from "../../../__utils__/runtime-check-utils";

assertEqual(numberStringCompare("a12b41", "a2b398k") > 0, true);
