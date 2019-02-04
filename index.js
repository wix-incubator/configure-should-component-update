module.exports = {
  createStructuredEqualityComparer: require('./src/createStructuredEqualityComparer'),
  configureShouldComponentUpdate: require('./src/configureShouldComponentUpdate'),

  strictEqual: require('./src/strictEqual'),
  shallowEqual: {
    arrays: require('./src/shallowEqualArrays'),
    objects: require('./src/shallowEqualObjects'),
  },
};
