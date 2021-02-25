export interface SingleLinkedNode<T> {
  value: T;
  next?: SingleLinkedNode<T>;
}

export interface DoubleLinkedNode<T> extends SingleLinkedNode<T> {
  next?: DoubleLinkedNode<T>;
  prev?: DoubleLinkedNode<T>;
}
