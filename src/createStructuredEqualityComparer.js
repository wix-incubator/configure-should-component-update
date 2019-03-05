const isObject = require('./isObject');
const strictEqual = require('./strictEqual');

function createStructuredEqualityComparer(comparers) {
  if (__DEV__) {
    if (!isObject(comparers) || typeof comparers === 'function') {
      console.warn('The passed `comparers` to createStructuredEqualityComparer() should be a plain object.');
    }
  }

  function structuredEqualityComparer(a, b) {
    if (!isObject(a) || !isObject(b)) {
      return strictEqual(a, b);
    }

    const keys = new Set([
      ...Object.keys(a),
      ...Object.keys(b),
    ]);

    for (const key of keys) {
      const equalityComparer = comparers[key] || strictEqual;
      if (!equalityComparer(a[key], b[key], key, a, b)) {
        return false;
      }
    }

    return true;
  }

  return structuredEqualityComparer;
}

module.exports = createStructuredEqualityComparer;
