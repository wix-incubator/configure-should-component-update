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

      const oldProps = {text: 'old'};
      const oldState = {checked: false};

      const dummy = new Dummy(oldProps, oldState);

      const newProps = {text: 'new'};
      const newState = {checked: true};

      expect(dummy.shouldComponentUpdate(newProps, newState)).toBe(false);
      expect(text).toHaveBeenCalledWith('old', 'new', 'text', oldProps, newProps);
      expect(checked).toHaveBeenCalledWith(false, true, 'checked', oldState, newState);
    });

    it('should provide extensible interface for comparing props and state manually', () => {
      const props = jest.fn(() => true), state = jest.fn(() => true);

      configureShouldComponentUpdate(Dummy, { props, state });

      const oldProps = {text: 'old'}, newProps = {text: 'new'};
      const oldState = {checked: false}, newState = {checked: true};

      const dummy = new Dummy(oldProps, oldState);
      expect(dummy.shouldComponentUpdate(newProps, newState)).toBe(false);

      const next = { props: newProps, state: newState };
      expect(props).toHaveBeenCalledWith(oldProps, newProps, 'props', dummy, expect.objectContaining(next));
      expect(state).toHaveBeenCalledWith(oldState, newState, 'state', dummy, expect.objectContaining(next));
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
      expect(state).toHaveBeenCalledWith(2, 4, 'state', dummy, jasmine.objectContaining({ props: 3, state: 4 }));

      props.mockReturnValue(false);
      state.mockReturnValue(true);

      expect(dummy.shouldComponentUpdate(3, 4)).toBe(true);
      expect(props).toHaveBeenCalledWith(1, 3, 'props', dummy, jasmine.objectContaining({ props: 3, state: 4 }));

      props.mockReturnValue(true);
      state.mockReturnValue(true);

      expect(dummy.shouldComponentUpdate(3, 4)).toBe(false);
    });
  });
});
