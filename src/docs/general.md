# Docs in brief

## module style

Each module has a namespace.

Each folder should have an index.ts as the output.

The father module is responsible for naming its child module, like

```ts
export * as ChildModuleName from "./child-module-folder-name";
```

If the module's implementation falls into several parts of files, the folder should export its names:

```ts
export * from "./some-implement-file.ts";
```
