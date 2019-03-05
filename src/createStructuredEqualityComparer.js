const isObject = require('./isObject');
const strictEqual = require('./strictEqual');

function createStructuredEqualityComparer(comparers, options) {
  if (__DEV__) {
    if (!isObject(comparers)) {
      console.warn('The passed `comparers` to createStructuredEqualityComparer() should be an object.');
    }
  }

  const defaultEqualityComparer = options && options.defaultEqualityComparer || strictEqual;

  function structuredEqualityComparer(a, b, key, contextA, contextB) {
    if (!isObject(a) || !isObject(b)) {
      return defaultEqualityComparer(a, b, key, contextA, contextB);
    }

    const keys = new Set([
      ...Object.keys(a),
      ...Object.keys(b),
    ]);

    for (const key of keys) {
      const equalityComparer = comparers[key] || defaultEqualityComparer;
      if (!equalityComparer(a[key], b[key], key, a, b)) {
        return false;
      }
    }

    return true;
  }

  return structuredEqualityComparer;
}

module.exports = createStructuredEqualityComparer;
