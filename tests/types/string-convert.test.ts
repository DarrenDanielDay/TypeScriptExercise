import {
  PascalCase,
  SnakeCase,
  SmallCamelCase,
  KebabCase,
} from "../../src/types/string-convert";
import { StaticTypeCheck } from "../__utils__";

StaticTypeCheck.assertExpressionAssignable<PascalCase<"AspNetCore">>("AspNetCore");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"asp_net_core">>("AspNetCore");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"aspNetCore">>("AspNetCore");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"asp-net-core">>("AspNetCore");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"a">>("A");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"A">>("A");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"">>("");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"1">>("1");
StaticTypeCheck.assertExpressionAssignable<PascalCase<"a123bc">>("A123Bc");

const AspNetCore1: PascalCase<"AspNetCore"> = "AspNetCore";
const AspNetCore2: PascalCase<"asp_net_core"> = "AspNetCore";
const AspNetCore3: PascalCase<"aspNetCore"> = "AspNetCore";
const AspNetCore4: PascalCase<"asp-net-core"> = "AspNetCore";
const lower1: PascalCase<"a"> = "A";
const upper1: PascalCase<"A"> = "A";
const empty1: PascalCase<""> = "";
const digit1: PascalCase<"1"> = "1";
const digits1: PascalCase<"a123bc"> = "A123Bc";

StaticTypeCheck.assertExpressionAssignable<SnakeCase<"AspNetCore">>("asp_net_core");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"asp_net_core">>("asp_net_core");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"aspNetCore">>("asp_net_core");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"asp-net-core">>("asp_net_core");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"a">>("a");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"A">>("a");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"">>("");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"1">>("1");
StaticTypeCheck.assertExpressionAssignable<SnakeCase<"a123bc">>("a_123_bc");

const asp_net_core1: SnakeCase<"AspNetCore"> = "asp_net_core";
const asp_net_core2: SnakeCase<"asp_net_core"> = "asp_net_core";
const asp_net_core3: SnakeCase<"aspNetCore"> = "asp_net_core";
const asp_net_core4: SnakeCase<"asp-net-core"> = "asp_net_core";
const lower2: SnakeCase<"a"> = "a";
const upper2: SnakeCase<"A"> = "a";
const empty2: SnakeCase<""> = "";
const digit2: SnakeCase<"1"> = "1";
const digits2: SnakeCase<"a123bc"> = "a_123_bc";

StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"AspNetCore">>("aspNetCore");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"asp_net_core">>("aspNetCore");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"aspNetCore">>("aspNetCore");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"asp-net-core">>("aspNetCore");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"a">>("a");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"A">>("a");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"">>("");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"1">>("1");
StaticTypeCheck.assertExpressionAssignable<SmallCamelCase<"a123bc">>("a123Bc");

const aspNetCore1: SmallCamelCase<"AspNetCore"> = "aspNetCore";
const aspNetCore2: SmallCamelCase<"asp_net_core"> = "aspNetCore";
const aspNetCore3: SmallCamelCase<"aspNetCore"> = "aspNetCore";
const aspNetCore4: SmallCamelCase<"asp-net-core"> = "aspNetCore";
const lower3: SmallCamelCase<"a"> = "a";
const upper3: SmallCamelCase<"A"> = "a";
const empty3: SmallCamelCase<""> = "";
const digit3: SmallCamelCase<"1"> = "1";
const digits3: SmallCamelCase<"a123bc"> = "a123Bc";

StaticTypeCheck.assertExpressionAssignable<KebabCase<"AspNetCore">>("asp-net-core");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"asp_net_core">>("asp-net-core");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"aspNetCore">>("asp-net-core");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"asp-net-core">>("asp-net-core");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"a">>("a");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"A">>("a");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"">>("");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"1">>("1");
StaticTypeCheck.assertExpressionAssignable<KebabCase<"a123bc">>("a-123-bc");

const KebabCase1: KebabCase<"AspNetCore"> = "asp-net-core";
const KebabCase2: KebabCase<"asp_net_core"> = "asp-net-core";
const KebabCase3: KebabCase<"aspNetCore"> = "asp-net-core";
const KebabCase4: KebabCase<"asp-net-core"> = "asp-net-core";
const lower4: KebabCase<"a"> = "a";
const upper4: KebabCase<"A"> = "a";
const empty4: KebabCase<""> = "";
const digit4: KebabCase<"1"> = "1";
const digits4: KebabCase<"a123bc"> = "a-123-bc";
