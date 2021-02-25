import { Internal } from "../..";
import { Container } from "./container";
import { SingleLinkedNode } from "./linked-list";

export interface Queue<T> extends Container<T> {
  append(value: T): void;
  serve(): T;
  readonly front: T | undefined;
  readonly back: T | undefined;
}

export class LinkedQueue<T> implements Queue<T> {
  static create<T>(...initValues: T[]) {
    const queue = new LinkedQueue<T>();
    for (const item of initValues) {
      queue.append(item);
    }
    return queue;
  }
  protected head?: SingleLinkedNode<T>;
  protected tail?: SingleLinkedNode<T>;
  protected _size: number = 0;
  constructor() {}
  get size() {
    return this._size;
  }
  get entries(): Iterable<T> {
    return function* (this: LinkedQueue<T>) {
      let current = this.head;
      while (current) {
        yield current.value;
        current = current.next;
      }
    }.call(this);
  }
  get front() {
    return this.head?.value;
  }
  get back() {
    return this.tail?.value;
  }

  get empty() {
    return this.head === undefined;
  }

  append(value: T) {
    this._size++;
    if (this.empty) {
      this.head = this.tail = { value };
      return;
    }
    if (this.tail) {
      this.tail.next = { value };
      this.tail = this.tail.next;
      return;
    }
    return Internal.fatal("Queue detected in invalid state.");
  }

  serve(): T {
    if (this.empty) {
      return Internal.error("Cannot serve with empty queue.");
    }
    this._size--;
    const result = this.head!.value;
    this.head = this.head!.next;
    return result;
  }
}
