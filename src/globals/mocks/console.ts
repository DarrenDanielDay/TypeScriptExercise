import fs from "fs";
import { Console } from "console";
import { createMock } from "./common";

export const consoleMock = createMock({
  console: new Console(fs.createWriteStream("mock-console.log")),
});
