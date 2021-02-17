import { fs, path } from "./common";

export interface IFile {
  path: string;
  parentFolder: IFolder | null;
  fileName: string;
  content: string;
  read(): Promise<void>;
  write(content: string): Promise<void>;
}

export interface IFolder {
  folderName: string;
  path: string;
  subFolders: IFolder[];
  files: IFile[];
  parentFolder: IFolder | null;
  open(recursive: boolean): Promise<void>;
}

export class LocalFile implements IFile {
  content: string = "";
  constructor(
    public fileName: string,
    public parentFolder: IFolder | null = null
  ) {}
  get path() {
    return path.join(
      this.parentFolder?.path ?? path.resolve("."),
      this.fileName
    );
  }
  async read() {
    this.content = await fs.readFile(this.path, { encoding: "utf-8" });
  }
  async write(content: string) {
    this.content = content;
    await fs.writeFile(this.path, content, { encoding: "utf-8" });
  }
}

export class LocalFolder implements IFolder {
  subFolders: IFolder[] = [];
  files: IFile[] = [];
  strategy?: {
    folderHook?(folder: IFolder): boolean;
    fileHook?(file: IFile): boolean;
  };
  constructor(
    public folderName: string,
    public parentFolder: IFolder | null = null
  ) {}
  get path() {
    return path.join(
      this.parentFolder?.path ?? path.resolve("."),
      this.folderName
    );
  }
  async open(recursive: boolean = true): Promise<void> {
    const root = this.path;
    const subPaths = await fs.readdir(root);
    const stats = await Promise.all(
      subPaths.map((subPath) => {
        return fs.stat(path.resolve(root, subPath)).then((stat) => ({
          isFolder: stat.isDirectory(),
          isFile: stat.isFile(),
          path: subPath,
        }));
      })
    );
    const folders = stats.filter((stat) => stat.isFolder);
    const files = stats.filter((stat) => stat.isFile);
    this.subFolders.length = 0;
    this.subFolders.push(
      ...folders
        .map((folder) =>
          new LocalFolder(folder.path, this).withStrategy(this.strategy)
        )
        .filter((folder) => this.strategy?.folderHook?.(folder) ?? true)
    );
    this.files.length = 0;
    this.files.push(
      ...files
        .map((file) => new LocalFile(file.path, this))
        .filter((file) => this.strategy?.fileHook?.(file) ?? true)
    );
    if (!recursive) return;
    await Promise.all(this.files.map((file) => file.read()));
    await Promise.all(this.subFolders.map((folder) => folder.open(recursive)));
  }

  withStrategy(strategy: this["strategy"]) {
    this.strategy = strategy;
    return this;
  }
}
