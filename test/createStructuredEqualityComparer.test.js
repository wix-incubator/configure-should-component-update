const createStructuredEqualityComparer = require('../src/createStructuredEqualityComparer');

describe('createStructuredEqualityComparer', () => {
  it('should warn on a non-object argument', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    createStructuredEqualityComparer();
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
  });

  describe('should create a comparer, which', () => {
    it('executes a strict equality check for non-objects', () => {
      const comparer = createStructuredEqualityComparer({});

      expect(comparer('abc', 'abc')).toBe(true);
      expect(comparer(null, undefined)).toBe(false);
    });

    it('can also have a custom default equality check', () => {
      const comparer = createStructuredEqualityComparer({}, {
        defaultEqualityComparer: (a, b) => a == b,
      });

      expect(comparer('123', 123)).toBe(true);
      expect(comparer(null, undefined)).toBe(true);
      expect(comparer(1, 4)).toBe(false);
      expect(comparer({ a: 1 }, { a: '1' })).toBe(true);
      expect(comparer({ a: 1 }, { a: '2' })).toBe(false);
    });

    it('passes arguments (value1, value2, key, obj1, obj2, context) into a property equality comparer', () => {
      const spy = jest.fn().mockReturnValue(true);
      const a = { prop: 'a' };
      const b = { prop: 'b' };
      const context = { a, b };

      const comparer = createStructuredEqualityComparer({ prop: spy });

      expect(comparer(a, b, context)).toBe(true);
      expect(spy).toHaveBeenCalledWith('a', 'b', 'prop', a, b, context);

      spy.mockReturnValue(false);
      expect(comparer(a, b)).toBe(false);
    });

    it('passes arguments (value1, value2, undefined, value1, value2, context) into default equality comparer when non-objects are compared', () => {
      const defaultEqualityComparer = jest.fn().mockImplementation((a, b, _, _a, _b, context) => {
        return (a + context) === (b * context);
      });

      const comparer = createStructuredEqualityComparer({}, {defaultEqualityComparer});
      expect(comparer(2, 2, 2)).toBe(true);
      expect(comparer(2, 2, 3)).toBe(false);
      expect(defaultEqualityComparer).toHaveBeenCalledWith(2, 2, undefined, 2, 2, 3);
    });

    describe('for example', () => {
      let comparer;

      beforeEach(() => {
        comparer = createStructuredEqualityComparer({
          known: (a, b) => a.length === b.length,
        });
      });

      it('when not given a custom comparer for the property, executes a shallow comparison', () => {
        expect(comparer({known: [], unknown: 123}, {known: [], unknown: 123})).toBe(true);
        expect(comparer({known: [], unknown: []}, {known: [], unknown: []})).toBe(false);
      });

      it('when given a custom comparer for the property, uses it for a comparison', () => {
        expect(comparer({known: [1, 2]}, {known: [3, 4]})).toBe(true);
        expect(comparer({known: [1, 2]}, {known: [3, 4, 5]})).toBe(false);
      });
    });
  });
});
