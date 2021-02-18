import child_process from "child_process";
const fs: typeof import("fs/promises") = require("fs").promises;

const folders = ["./dist", "./node_modules"];
const args = process.argv;
async function main() {
  await Promise.all(
    folders.map((folder) =>
      fs.rm(folder, { recursive: true, force: true }).catch((e) => {
        console.error(`❌ remove ${folder} failed:`, e);
      })
    )
  );
  if (args.includes("--git")) {
    await new Promise<void>((resolve, reject) => {
      child_process.exec(
        "git stash --include-untracked;git stash drop stash@{0};",
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }
}
main().finally(() => {
  console.log("🧹clean script finished.");
});
// Convert this script to a module.
export {};
