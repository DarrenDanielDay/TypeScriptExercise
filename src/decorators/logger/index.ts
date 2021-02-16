import {
  globalDecoratorContext,
  withContext,
} from "../../interfaces/decorators";

export const logger = withContext(globalDecoratorContext)
  .withClass(Object)
  .createDecorators({
    log: {
      type: "method",
      hooks: {
        wrapper({ originalFunc, runtimeArgs, keyInfo }) {
          console.log(
            `${new Date().toLocaleDateString()}`,
            `Call ${
              keyInfo.prototype.constructor.name
            }.${keyInfo.key.toString()}`
          );
          const result = originalFunc.apply(this, runtimeArgs);
          console.log(
            `${new Date().toLocaleDateString()}`,
            `End of call ${
              keyInfo.prototype.constructor.name
            }.${keyInfo.key.toString()}`
          );
          return result;
        },
      },
    },
  });
