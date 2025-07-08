const { fetch } = require('../src');

test('fetch returns Hello World', async () => {
  const response = await fetch();
  const text = response instanceof Response ? await response.text() : response;
  expect(text).toBe('Hello World');
});
