import { Internal } from "../..";
import { Container } from "./container";
import { SingleLinkedNode } from "./linked-list";

export interface Stack<T> extends Container<T> {
  push(value: T): void;
  pop(): T;
  readonly top: T | undefined;
  readonly bottom: T | undefined;
}

export class LinkedStack<T> implements Stack<T> {
  static create<T>(...initValues: T[]) {
    const stack = new LinkedStack<T>();
    for (const value of initValues) {
      stack.push(value);
    }
    return stack;
  }
  protected head?: SingleLinkedNode<T>;
  protected tail?: SingleLinkedNode<T>;
  protected _size: number = 0;
  constructor() {}
  get top() {
    return this.head?.value;
  }
  get bottom() {
    return this.tail?.value;
  }
  get empty() {
    return this.head === undefined;
  }
  get size() {
    return this._size;
  }
  get entries(): Iterable<T> {
    return function* (this: LinkedStack<T>) {
      let current = this.head;
      while (current) {
        yield current.value;
        current = current.next;
      }
    }.call(this);
  }
  push(value: T): void {
    this._size++;
    const { head } = this;
    if (!head) {
      this.head = this.tail = { value };
      return;
    }
    const newNode = { value, next: head };
    this.head = newNode;
  }
  pop(): T {
    const { head } = this;
    if (!head) {
      return Internal.error("Cannot pop from empty stack!");
    }
    this._size--;
    this.head = head.next;
    if (!head.next) {
      this.tail = undefined;
    }
    return head.value;
  }
}
