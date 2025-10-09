async function fetch(request) {
  // Cloudflare Workers receive the Request instance. For the purposes of the
  // basic sanity test we simply ignore it and always return "Hello World".
  return new Response('Hello World', {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

const worker = { fetch };

module.exports = worker;
module.exports.fetch = fetch;
module.exports.default = worker;
