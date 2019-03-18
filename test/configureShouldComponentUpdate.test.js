const PropTypes = require('prop-types');
const configureShouldComponentUpdate = require('../src/configureShouldComponentUpdate');

const noop = () => {};

describe('configureShouldComponentUpdate(ComponentClass, options)', () => {
  describe('unhappy paths', () => {
    it('should assert that the component class is valid', () => {
      jest.spyOn(console, 'error').mockImplementation(noop);
      expect(() => configureShouldComponentUpdate()).toThrow();
      expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should assert that the passed options are an object', () => {
      jest.spyOn(console, 'error').mockImplementation(noop);
      expect(() => configureShouldComponentUpdate(class Foo {})).toThrow();
      expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should catch a case when args are accidentally swapped', () => {
      jest.spyOn(console, 'error').mockImplementation(noop);

      expect(() => configureShouldComponentUpdate({}, class Foo {})).toThrow();
      expect(console.error.mock.calls[0][0]).toMatchSnapshot();
      expect(console.error.mock.calls[1][0]).toMatchSnapshot();
    });

    it('should assert that the props equality comparers correspond to the ComponentClass.propTypes', () => {
      class Foo {
        static propTypes = {
          known: PropTypes.any,
        };
      }

      jest.spyOn(console, 'warn').mockImplementation(noop);

      configureShouldComponentUpdate(Foo, {
        props: {
          aTypo: (a, b) => a == b,
        },
      });

      expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('should add to the prototype a shouldComponentUpdate function, which', () => {
    let Dummy;

    beforeEach(() => {
      Dummy = class Dummy {
        static propTypes = {
          text: PropTypes.string,
        };

        constructor(props, state) {
          this.props = props;
          this.state = state;
        }
      };
    });

    it('should provide declarative interface for comparing props and state with a rich comparator signature', () => {
      const text = jest.fn(() => true), checked = jest.fn(() => true);

      configureShouldComponentUpdate(Dummy, {
        props: { text },
        state: { checked },
      });

      const props = {text: 'old'};
      const state = {checked: false};
      const nextProps = {text: 'new'};
      const nextState = {checked: true};
      const dummy = new Dummy(props, state);

      expect(dummy.shouldComponentUpdate(nextProps, nextState)).toBe(false);

      const expectedContext = {
        state,
        props,
        nextState,
        nextProps,
      };

      expect(checked).toHaveBeenCalledWith(false, true, { ...expectedContext, key: 'state.checked' });
      expect(text).toHaveBeenCalledWith('old', 'new', { ...expectedContext, key: 'props.text' });
    });

    it('should provide extensible interface for comparing props and state manually', () => {
      const config = {
        props: jest.fn(() => true),
        state: jest.fn(() => true),
      };

      configureShouldComponentUpdate(Dummy, config);

      const props = {text: 'old'}, nextProps = {text: 'new'};
      const state = {checked: false}, nextState = {checked: true};

      const dummy = new Dummy(props, state);
      expect(dummy.shouldComponentUpdate(nextProps, nextState)).toBe(false);

      const expectedContext = {
        state,
        props,
        nextState,
        nextProps,
      };

      expect(config.props).toHaveBeenCalledWith(props, nextProps, { ...expectedContext, key: 'props' });
      expect(config.state).toHaveBeenCalledWith(state, nextState, { ...expectedContext, key: 'state' });
    });

    it('should shallowly check state for equality if no customizers given only for props', () => {
      configureShouldComponentUpdate(Dummy, {
        props: {
          text: (a, b) => a.toLowerCase() === b.toLowerCase(),
        },
      });

      const dummy = new Dummy({text: 'TEXT'}, {three: 3});

      expect(dummy.shouldComponentUpdate({text: 'text'}, {three: 3})).toBe(false);
      expect(dummy.shouldComponentUpdate({text: 'text', one: 1}, {three: 3})).toBe(true);
      expect(dummy.shouldComponentUpdate({text: 'TEXT'}, {three: 3, four: 4})).toBe(true);
    });

    it('should shallowly check props for equality if no customizers given only for state', () => {
      configureShouldComponentUpdate(Dummy, {
        state: {
          three: (a, b) => a == b,
        },
      });

      const dummy = new Dummy({text: 'TEXT'}, {three: 3});

      expect(dummy.shouldComponentUpdate({text: 'TEXT'}, {three: '3'})).toBe(false);
      expect(dummy.shouldComponentUpdate({text: 'text'}, {three: '3'})).toBe(true);
      expect(dummy.shouldComponentUpdate({text: 'TEXT'}, {three: '4'})).toBe(true);
    });

    it('should pass props and state to given customizers if they are functions', () => {
      const props = jest.fn(), state = jest.fn();
      configureShouldComponentUpdate(Dummy, { props, state });
      const dummy = new Dummy(1, 2);

      props.mockReturnValue(true);
      state.mockReturnValue(false);

      expect(dummy.shouldComponentUpdate(3, 4)).toBe(true);
      expect(state).toHaveBeenCalledWith(2, 4, {
        props: 1,
        state: 2,
        nextProps: 3,
        nextState: 4,
        key: 'state',
      });

      props.mockReturnValue(false);
      state.mockReturnValue(true);

      expect(dummy.shouldComponentUpdate(3, 4)).toBe(true);
      expect(props).toHaveBeenCalledWith(2, 4, {
        props: 1,
        state: 2,
        nextProps: 3,
        nextState: 4,
        key: 'props',
      });

      props.mockReturnValue(true);
      state.mockReturnValue(true);

      expect(dummy.shouldComponentUpdate(3, 4)).toBe(false);
    });
  });
});
