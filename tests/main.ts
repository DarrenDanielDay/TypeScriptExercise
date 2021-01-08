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

function requireTheModule(id: string) {
  console.log(`testing: ${id}`);
  require(id);
  console.log(`finished ${id}`);
}

async function testModule(requirePath: string) {
  try {
    const stat = await fs.stat(toPath(requirePath));
    if (stat.isDirectory()) {
      const files = await fs.readdir(toPath(requirePath));
      for (let file of files) {
        const moduleName = `${requirePath}/${file}`;
        setTimeout(() => {
          testModule(moduleName);
        }, 0);
      }
    } else {
      requireTheModule(toRequire(requirePath));
    }
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  const [ts_node, main_ts, targetModule] = process.argv;
  console.log([ts_node, main_ts, targetModule]);
  console.log(`target module: ${targetModule}`);
  if (targetModule) {
    testModule(targetModule);
  } else {
    const moduleNames = await fs.readdir(TEST_PATH);
    for (let moduleName of moduleNames.filter(
      (moduleName) => !/__.*__/.test(moduleName)
    )) {
      testModule(moduleName);
    }
  }
}

main().then(() => {
  console.log("done!");
});
