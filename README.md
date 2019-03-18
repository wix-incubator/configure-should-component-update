# configure-should-component-update

[![npm version](https://badge.fury.io/js/configure-should-component-update.svg)](https://badge.fury.io/js/configure-should-component-update)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/wix-incubator/configure-should-component-update.svg?branch=master)](https://travis-ci.org/wix-incubator/configure-should-component-update)
[![Coverage Status](https://coveralls.io/repos/github/wix-incubator/configure-should-component-update/badge.svg?branch=master)](https://coveralls.io/github/wix-incubator/configure-should-component-update?branch=master)


Provides a function to build a customized React's shouldComponentUpdate() function in a declarative way.

## Example

```javascript
  import React from 'react';
  import {configureShouldComponentUpdate} from 'configure-should-component-update';

  class Label extends React.Component {
    static propTypes = {
      text: PropTypes.string,
      color: PropTypes.any,
    };

    render() {
      // ...
    }
  }

  configureShouldComponentUpdate(Label, {
    props: {
      text: (prev, next, { key, props, state, nextProps, nextState }) => a == b,
    },
    state(prevState, nextState, { props, nextProps }) {
      return prevState.pressed === nextState.pressed && !nextProps.disabled;
    }
  });
```

Here `configureShouldComponentUpdate` function call will create a function in
`Label.prototype.shouldComponentUpdate`, which will be shallowly comparing
`this.props` with `nextProps` and `this.state` with `nextState`, but in addition to it,
the preconfigured properties like `text` will use the corresponding equality comparers
you provide.

Hence, in our example, if `<Label>` is rendered with `text="3"` and then, with `text={3}`,
we are not going to have an extra re-render.

## TODO

More documentation is to follow.

## License

Licensed under [MIT License](LICENSE).
