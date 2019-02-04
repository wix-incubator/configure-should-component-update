const index = require('..');

describe('exported API', () => {
  it('should match the snapshot', () => {
    expect(index).toMatchSnapshot();
  });
});
