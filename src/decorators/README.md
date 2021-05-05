# Decorators

## Typescript implementation

### Polyfill

```ts
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
```

### Logic

```txt
1. parameter:
c = 4, target = prototype, desc = null
==> r = desc = descriptor of prototype[key]
d(prototype, key, index)
redefine prototype[key] with r

2.a method/getter/setter:
c = 4, target = prototype, desc = null
==> r = desc = descriptor of prototype[key]
r = d(prototype, key, descriptor of prototype[key]) || r
redefine prototype[key] with r

2.b property:
c = 4, target = prototype, desc = undefined
r = undefined
d(prototype, key, undefined)
NO redefine

3. class:
c = 2, desc = undefined, r = target = class,
return d(class) || class
NO redefine
```

## Principles

The `parameter` decorator should only provide decorated information.

The `method/getter/setter` decorator should provide a wrapped function.

The `property` decorator should provide both getter and setter.

The `class` decorator should do the define property job with given context.
