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

## code style

**`ANY` IS NOT ALLOWED WHEN NOT NECESSARY**

Use `unknown` and `never` when `any` is not necessary.

```ts
function tricky(): string {
  // Declare a variable with type `unknown` to make everything assinable to it:
  let foo: unknown = 1;
  // NOT ALLOWED:
  // let foo: any = 1;

  // Cast a value to `never` to make it assignable to `any` variable:
  return foo as never;
  // BAD:
  // return foo as any
}
```

Currently, `any` is only allowed in `type-guards` in this project.

```ts
type GuardUnion<Arr extends ((o: any) => o is unknown)[]> = Arr extends ((
  // Here, `any` is the best choice for parameter `o`.
  o: any
) => o is infer R)[]
  ? R
  : never;
```
