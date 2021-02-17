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
  try {
    require(id);
    console.log(`✅passed ${id}`);
  } catch (e) {
    console.error(`❌failed ${id}`);
    throw e;
  }
}
const errorModules: string[] = [];
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
      requireTheModule(toRequire(requirePath));
    }
  } catch (e) {
    errorModules.push(requirePath);
    console.error(e);
  }
}

async function main() {
  const [ts_node, main_ts, targetModule] = process.argv;
  console.log([ts_node, main_ts, targetModule]);
  console.log(`target module: ${targetModule}`);
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
