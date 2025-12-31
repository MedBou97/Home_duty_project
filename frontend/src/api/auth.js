import { api, token } from "./http.js";

export async function login(email, password) {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  token.set(data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}
export function logout() {
  token.set(null);
  localStorage.removeItem("user");
}
export function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
