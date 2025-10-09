const { fetch } = require('../src');

test('fetch returns Hello World', async () => {
  const response = await fetch();
  const text = await response.text();
  expect(text).toBe('Hello World');
});
