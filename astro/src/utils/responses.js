export function json(body, status = 200, extra = {}) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...extra,
      },
    }
  );
}

export function notFound() {
  return json({ ok: false, error: "Not found" }, 404);
}

export function error(message = "Internal error", status = 500) {
  return json({ ok: false, error: message }, status);
}
