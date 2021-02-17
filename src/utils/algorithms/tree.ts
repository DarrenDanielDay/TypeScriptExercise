export interface ITreeNode<T> {
  entry: T;
  children: ITreeNode<T>[];
  parent?: ITreeNode<T>;
}
