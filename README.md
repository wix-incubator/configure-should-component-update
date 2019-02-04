# configure-should-component-update

Provides a function to configure React's shouldComponentUpdate() function in a declarative way.

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
      text: (a, b) => a == b,
    },
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
