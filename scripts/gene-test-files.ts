import path from "path";
const fs: typeof import("fs/promises") = require("fs").promises;
const cwd = process.cwd();
const srcFolder = path.resolve(cwd, "src");
const testFolder = path.resolve(cwd, "tests");
const extensionName = ".ts";
const excludeFolders = ["docs", "examples"];
const excludeFilePatterns = [
  new RegExp(`playground\.*`),
  /main\.ts/,
  /index.ts/,
  /\*\.d\.ts/,
];
async function* walk(
  dir: string,
  callback: (folder: string, fileName: string) => Promise<void>
): AsyncGenerator<void, void, unknown> {
  const stat = await fs.stat(dir);
  if (excludeFolders.includes(path.parse(dir).name)) return;
  if (stat.isFile()) {
    yield await callback(path.dirname(dir), dir);
    return;
  }
  if (stat.isDirectory()) {
    const folders = await fs.readdir(dir);
    for await (const folder of folders) {
      yield* walk(path.join(dir, folder), callback);
    }
    return;
  }
}

async function ensureFolderCreated(folder: string) {
  try {
    const stat = await fs.stat(folder);
    if (stat.isDirectory()) {
      return;
    }
  } catch {
    // do nothing
  }
  await ensureFolderCreated(path.dirname(folder));
  await fs.mkdir(folder);
}

async function main() {
  for await (let unused of walk(srcFolder, async (folder, fileName) => {
    if (!fileName.includes(extensionName)) return;
    if (excludeFilePatterns.some((p) => p.test(fileName))) return;
    const relative = path.relative(srcFolder, folder);
    const parentFolder = path.resolve(testFolder, relative);
    await ensureFolderCreated(parentFolder);
    const targetFile = path.resolve(
      testFolder,
      relative,
      `${path.basename(fileName, extensionName)}.test.ts`
    );
    try {
      const file = await fs.stat(targetFile);
      if (file.isFile()) {
        return;
      }
    } catch {
      // do nothing
    }
    await fs.writeFile(targetFile, "");
  })) {
    unused;
  }
}

main()
  .catch((e) => {
    console.log("❌err!", e);
  })
  .finally(() => {
    console.log("✅Generate script done.");
  });
