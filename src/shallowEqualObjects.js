const shallowEqual = require('shallow-equal/objects');

function shallowEqualObjects(a, b) {
  if (!a || !b) return a === b;
  return shallowEqual(a, b);
}

module.exports = shallowEqualObjects;
