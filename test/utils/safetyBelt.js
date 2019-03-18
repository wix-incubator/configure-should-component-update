function shallowClone(x) {
  return x != null && typeof x === 'object' ? { ...x } : x;
}

/***
 * Clones arguments before passing to spy.
 * Facilitates testing methods that mutate args on purpose
 *
 * @param {Function} spy
 * @returns {Function} spy
 */
function safetyBelt(spy) {
  function spyInSafetyBelt() {
    const clonedArguments = Array.prototype.map.call(arguments, shallowClone);
    return spy.apply(this, clonedArguments);
  }

  return Object.assign(spyInSafetyBelt, spy);
}

module.exports = safetyBelt;
