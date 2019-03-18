const createStructuredEqualityComparer = require('../src/createStructuredEqualityComparer');

describe('createStructuredEqualityComparer', () => {
  it('should warn on a non-object argument', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    createStructuredEqualityComparer();
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
  });

  it('should warn on a function argument', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    createStructuredEqualityComparer(jest.fn());
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
  });

  describe('should create a comparer, which', () => {
    it('executes a strict equality check for non-objects', () => {
      const comparer = createStructuredEqualityComparer({});

      expect(comparer('abc', 'abc')).toBe(true);
      expect(comparer(null, undefined)).toBe(false);
    });

    it('passes arguments (value1, value2, key, obj1, obj2) into a property equality comparer', () => {
      const spy = jest.fn().mockReturnValue(true);
      const a = { prop: 'a' };
      const b = { prop: 'b' };

      const comparer = createStructuredEqualityComparer({ prop: spy });

      expect(comparer(a, b)).toBe(true);
      expect(spy).toHaveBeenCalledWith('a', 'b', { key: 'prop' });

      spy.mockReturnValue(false);
      expect(comparer(a, b)).toBe(false);
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
