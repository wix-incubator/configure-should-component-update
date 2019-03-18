const shallowEqual = require('shallow-equal/objects');
const createStructuredEqualityComparer = require('./createStructuredEqualityComparer');

function configureShouldComponentUpdate(ComponentClass, options) {
  if (__DEV__) {
    assertComponentClassIsValid(ComponentClass);
    assertOptionsAreAnObject(ComponentClass, options);
    assertThatEqualityComparersMatchPropTypes(ComponentClass, options.props);
  }

  const arePropsEqual = createEqualityComparer(options.props);
  const areStatesEqual = createEqualityComparer(options.state);

  function shouldComponentUpdate(nextProps, nextState) {
    const next = { props: nextProps, state: nextState };

    if (!arePropsEqual(this.props, nextProps, 'props', this, next)) {
      return true;
    }

    if (!areStatesEqual(this.state, nextState, 'state', this, next)) {
      return true;
    }

    return false;
  }

  ComponentClass.prototype.shouldComponentUpdate = shouldComponentUpdate;
}

function createEqualityComparer(option) {
  if (!option) return shallowEqual;
  if (typeof option === 'function') return option;

  return createStructuredEqualityComparer(option);
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

  if (propTypes && propsEqualityComparers && typeof propsEqualityComparers !== 'function') {
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
  return ComponentClass && (ComponentClass.displayName || ComponentClass.name) || 'Component';
}

module.exports = configureShouldComponentUpdate;
