async function request(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status}).`);
  }

  return json;
}

export function apiGet(url) {
  return request(url, { method: 'GET' });
}

export function apiPost(url, field, item) {
  return request(url, { method: 'POST', body: JSON.stringify({ field, item }) });
}

export function apiPatch(url, field, value, index = null) {
  const body = index === null ? { field, value } : { field, value, index };
  return request(url, { method: 'PATCH', body: JSON.stringify(body) });
}

export function apiDelete(url, field, index) {
  return request(url, { method: 'DELETE', body: JSON.stringify({ field, index }) });
}
