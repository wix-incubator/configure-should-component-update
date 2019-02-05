module.exports = {
  createStructuredEqualityComparer: require('./src/createStructuredEqualityComparer'),
  configureShouldComponentUpdate: require('./src/configureShouldComponentUpdate'),

  strictEqual: require('./src/strictEqual'),
  shallowEqual: {
    arrays: require('shallow-equal/arrays'),
    objects: require('shallow-equal/objects'),
  },
};
