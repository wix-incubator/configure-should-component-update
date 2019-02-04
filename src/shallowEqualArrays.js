const shallowEqual = require('shallow-equal/arrays');

function shallowEqualArrays(a, b) {
  if (!a || !b) return a === b;
  if (!Array.isArray(a) || !Array.isArray(b)) return a === b;

  return shallowEqual(a, b);
}

module.exports = shallowEqualArrays;
