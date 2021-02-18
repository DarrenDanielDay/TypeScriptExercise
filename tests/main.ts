import path from "path";

const fs: typeof import("fs/promises") = require("fs").promises;
const TEST_PATH = "./tests/";
function toRequire(str: string) {
  return `./${str}`.replace(TEST_PATH, "./");
}

function toPath(str: string) {
  if (str.startsWith(TEST_PATH)) {
    return str;
  }
  return `${TEST_PATH}${str}`;
}

async function requireTheModule(id: string) {
  const absolutePath = path.normalize(path.resolve(__dirname, id));
  try {
    const testCase = require(id);
    if (testCase) {
      const entry: unknown = testCase.main;
      if (typeof entry === "function") {
        const promise: unknown = entry.call(undefined);
        if (promise instanceof Promise) {
          await promise;
        }
      }
    }
    console.log(`✅passed ${absolutePath}`);
  } catch (e) {
    console.error(`❌failed ${absolutePath}`);
    throw e;
  }
}
const errorModules: string[] = [];

function isModuleFile(file: string) {
  return file.endsWith(".test.ts");
}

async function testModule(requirePath: string) {
  try {
    const stat = await fs.stat(toPath(requirePath));
    if (stat.isDirectory()) {
      const files = await fs.readdir(toPath(requirePath));
      for (let file of files) {
        const moduleName = `${requirePath}/${file}`;
        await testModule(moduleName);
      }
    } else {
      if (isModuleFile(requirePath))
        await requireTheModule(toRequire(requirePath));
    }
  } catch (e) {
    errorModules.push(requirePath);
    console.error(e);
  }
}

async function main() {
  const [ts_node, main_ts, targetModule] = process.argv;
  console.log("Test arguments:", [ts_node, main_ts, targetModule]);
  console.log(`Target module: ${targetModule}`);
  if (typeof targetModule === "undefined") {
    console.log("All test cases will be tested.");
  }
  if (targetModule) {
    await testModule(targetModule);
  } else {
    const moduleNames = await fs.readdir(TEST_PATH);
    for (let moduleName of moduleNames.filter(
      (moduleName) => !/__.*__/.test(moduleName)
    )) {
      await testModule(moduleName);
    }
  }
}

main()
  .then(() => {
    if (errorModules.length) {
      console.error("❌Oops! Some test failed!");
      for (const path of errorModules) {
        console.error(`🔺 ${path}`);
      }
    } else {
      console.log("✅Awesome! All passed!");
    }
  })
  .catch((e) => {
    console.error("❗️Oops, internal error occurred:", e);
  });

// Convert this script to a module.
export {};
