export function router(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  return function match(pattern) {
    return path === pattern || path.startsWith(pattern + "/");
  };
}
