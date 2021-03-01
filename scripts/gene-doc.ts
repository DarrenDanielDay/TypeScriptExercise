import * as typedoc from "typedoc";

async function main() {
  const app = new typedoc.Application();

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new typedoc.TSConfigReader());
  app.options.addReader(new typedoc.TypeDocReader());

  app.bootstrap({
    // typedoc options here
    entryPoints: ["src"],
  });

  const project = app.convert();

  if (project) {
    // Project may not have converted correctly
    const outputDir = "script-docs";

    // Rendered docs
    await app.generateDocs(project, outputDir);
    // Alternatively generate JSON output
    await app.generateJson(project, outputDir + "/documentation.json");
  }
}

main().catch(console.error);
