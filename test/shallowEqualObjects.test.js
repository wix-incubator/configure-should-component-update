const shallowEqualObjects = require('../src/shallowEqualObjects');

describe('shallowEqualObjects', () => {
  it('should compare {} vs undefined', () => {
    expect(shallowEqualObjects([], undefined)).toBe(false);
  });

  it('should compare undefined vs {}', () => {
    expect(shallowEqualObjects(undefined, [])).toBe(false);
  });

  it('should compare undefined vs null', () => {
    expect(shallowEqualObjects(undefined, null)).toBe(false);
  });

  it('should compare objects', () => {
    expect(shallowEqualObjects({}, {})).toBe(true);
  });

  it('should compare objects shallowly', () => {
    expect(shallowEqualObjects({a:{}}, {a:{}})).toBe(false);
  });
});
