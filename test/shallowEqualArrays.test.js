const shallowEqualArrays = require('../src/shallowEqualArrays');

describe('shallowEqualArrays', () => {
  it('should compare [] vs undefined', () => {
    expect(shallowEqualArrays([], undefined)).toBe(false);
  });

  it('should compare undefined vs []', () => {
    expect(shallowEqualArrays(undefined, [])).toBe(false);
  });

  it('should compare undefined vs null', () => {
    expect(shallowEqualArrays(undefined, null)).toBe(false);
  });

  it('should compare object vs array', () => {
    expect(shallowEqualArrays({}, [])).toBe(false);
  });

  it('should compare array vs object', () => {
    expect(shallowEqualArrays([], {})).toBe(false);
  });

  it('should compare arrays', () => {
    expect(shallowEqualArrays([1], [1])).toBe(true);
  });

  it('should compare arrays shallowly', () => {
    expect(shallowEqualArrays([{}], [{}])).toBe(false);
  });
});
