import { merge } from "../../../src/utils/function-tools/merge";
import { isGeneralObject } from "../../../src/utils/function-tools/type-guards";
import { assertEqual, assertThat } from "../../__utils__/runtime-check-utils";

const config = { a: 1 };
const mergedConfig = merge(config, { a: 2, c: {} });
assertEqual(config, mergedConfig);
assertEqual(config === mergedConfig, true);
assertThat(config as unknown, isGeneralObject);
assertEqual(config, { a: 2 });
