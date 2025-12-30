const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const token = {
  get: () => localStorage.getItem("token"),
  set: (t) =>
    t ? localStorage.setItem("token", t) : localStorage.removeItem("token"),
};

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const t = token.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}
