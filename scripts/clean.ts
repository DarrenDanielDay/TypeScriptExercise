const fs: typeof import("fs/promises") = require("fs").promises;

const folders = ["./dist", "./node_modules"];

async function main() {
  await Promise.all(
    folders.map((folder) =>
      fs.rm(folder, { recursive: true, force: true }).catch((e) => {
        console.error(`❌ remove ${folder} failed:`, e);
      })
    )
  );
}
main().finally(() => {
  console.log("🧹clean script finished.");
});
// Convert this script to a module.
export {};
