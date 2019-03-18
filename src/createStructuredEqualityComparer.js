const isObject = require('./isObject');
const strictEqual = require('./strictEqual');

class EmptyContext {
  constructor() {
    this.key = '';
  }
}

function nestKeys(key1, key2) {
  return key1 ? `${key1}.${key2}` : key2;
}

function createStructuredEqualityComparer(comparers) {
  if (__DEV__) {
    if (!isObject(comparers) || typeof comparers === 'function') {
      console.warn('The passed `comparers` to createStructuredEqualityComparer() should be a plain object.');
    }
  }

  function structuredEqualityComparer(a, b, context = new EmptyContext()) {
    if (!isObject(a) || !isObject(b)) {
      return strictEqual(a, b);
    }

    const keys = new Set([
      ...Object.keys(a),
      ...Object.keys(b),
    ]);

    const parentKey = context.key;
    for (const key of keys) {
      context.key = nestKeys(parentKey, key);

      const equalityComparer = comparers[key] || strictEqual;
      if (!equalityComparer(a[key], b[key], context)) {
        return false;
      }
    }

    return true;
  }

  return structuredEqualityComparer;
}

module.exports = createStructuredEqualityComparer;
