import {
  PascalCase,
  SnakeCase,
  SmallCamelCase,
  KebabCase,
} from "../../src/types/string-convert";
const AspNetCore1: PascalCase<"AspNetCore"> = "AspNetCore";
const AspNetCore2: PascalCase<"asp_net_core"> = "AspNetCore";
const AspNetCore3: PascalCase<"aspNetCore"> = "AspNetCore";
const AspNetCore4: PascalCase<"asp-net-core"> = "AspNetCore";
const lower1: PascalCase<"a"> = "A";
const upper1: PascalCase<"A"> = "A";
const empty1: PascalCase<""> = "";
const digit1: PascalCase<"1"> = "1";
const digits1: PascalCase<"a123bc"> = "A123Bc";


const asp_net_core1: SnakeCase<"AspNetCore"> = "asp_net_core";
const asp_net_core2: SnakeCase<"asp_net_core"> = "asp_net_core";
const asp_net_core3: SnakeCase<"aspNetCore"> = "asp_net_core";
const asp_net_core4: SnakeCase<"asp-net-core"> = "asp_net_core";
const lower2: SnakeCase<"a"> = "a";
const upper2: SnakeCase<"A"> = "a";
const empty2: SnakeCase<""> = "";
const digit2: SnakeCase<"1"> = "1";
const digits2: SnakeCase<"a123bc"> = "a_123_bc";

const aspNetCore1: SmallCamelCase<"AspNetCore"> = "aspNetCore";
const aspNetCore2: SmallCamelCase<"asp_net_core"> = "aspNetCore";
const aspNetCore3: SmallCamelCase<"aspNetCore"> = "aspNetCore";
const aspNetCore4: SmallCamelCase<"asp-net-core"> = "aspNetCore";
const lower3: SmallCamelCase<"a"> = "a";
const upper3: SmallCamelCase<"A"> = "a";
const empty3: SmallCamelCase<""> = "";
const digit3: SmallCamelCase<"1"> = "1";
const digits3: SmallCamelCase<"a123bc"> = "a123Bc";

const KebabCase1: KebabCase<"AspNetCore"> = "asp-net-core";
const KebabCase2: KebabCase<"asp_net_core"> = "asp-net-core";
const KebabCase3: KebabCase<"aspNetCore"> = "asp-net-core";
const KebabCase4: KebabCase<"asp-net-core"> = "asp-net-core";
const lower4: KebabCase<"a"> = "a";
const upper4: KebabCase<"A"> = "a";
const empty4: KebabCase<""> = "";
const digit4: KebabCase<"1"> = "1";
const digits4: KebabCase<"a123bc"> = "a-123-bc";
