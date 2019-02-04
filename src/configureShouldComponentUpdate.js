const shallowEqual = require('shallow-equal/objects');
const createStructuredEqualityComparer = require('./createStructuredEqualityComparer');

function configureShouldComponentUpdate(ComponentClass, options) {
  if (__DEV__) {
    assertComponentClassIsValid(ComponentClass);
    assertOptionsAreAnObject(ComponentClass, options);
    assertThatEqualityComparersMatchPropTypes(ComponentClass, options.props);
  }

  const arePropsShallowEqual = options.props
    ? createStructuredEqualityComparer(options.props)
    : shallowEqual;

  const areStatesShallowEqual = options.state
    ? createStructuredEqualityComparer(options.state)
    : shallowEqual;

  function shouldComponentUpdate(nextProps, nextState) {
    if (!areStatesShallowEqual(this.state, nextState, this)) {
      return true;
    }

    if (!arePropsShallowEqual(this.props, nextProps, this)) {
      return true;
    }

    return false;
  }

  ComponentClass.prototype.shouldComponentUpdate = shouldComponentUpdate;
}

function assertComponentClassIsValid(ComponentClass) {
  if (typeof ComponentClass !== 'function') {
    console.error(`Invalid component class given to configureShouldComponentUpdate() function, please check the arguments.`);
  }
}

function assertOptionsAreAnObject(ComponentClass, options) {
  const error = options ? (typeof options === 'object' ? '' : 'Non-object') : 'No';

  if (error) {
    const className = getComponentClassName(ComponentClass);
    const optionsMsg = typeof options === 'function' ? `fn ${options.name}` : options;
    console.error(`${error} options given to configureShouldComponentUpdate(${className}, ${optionsMsg}) function, please check the arguments.`);
  }
}

function assertThatEqualityComparersMatchPropTypes(ComponentClass, propsEqualityComparers) {
  const {propTypes} = ComponentClass;

  if (propTypes && propsEqualityComparers) {
    const className = getComponentClassName(ComponentClass);

    for (const key of Object.keys(propsEqualityComparers)) {
      if (!propTypes[key]) {
        console.warn(`Unknown prop "${key}" in class ${className}. `
            + `Make sure your custom equality comparer compares only known properties: ${Object.keys(propTypes)}.`);
      }
    }
  }
}

function getComponentClassName(ComponentClass) {
  return ComponentClass && (ComponentClass.displayName || ComponentClass.name) || String(ComponentClass);
}

module.exports = configureShouldComponentUpdate;