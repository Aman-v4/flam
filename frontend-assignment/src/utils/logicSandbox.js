export default function runUserLogic(logicString, values = {}) {
    try {
      const func = new Function('values', `
        "use strict";
        ${logicString}
      `);
      return func(values);
    } catch (err) {
      return `Logic error: ${err.message}`;
    }
  }
  