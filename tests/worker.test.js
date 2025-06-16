import worker from '../src/index.js';

test('fetch returns Hello World', async () => {
  const response = await worker.fetch(new Request('http://localhost/'));
  const text = await response.text();
  expect(text).toBe('Hello World');
});
