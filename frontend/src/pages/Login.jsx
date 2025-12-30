import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";

export default function Login() {
  const [email, setEmail] = useState("med@example.com");
  const [password, setPassword] = useState("med123");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">HomeDuty</h1>
        <p className="text-sm text-slate-300">
          Login (env-based demo accounts)
        </p>

        <input
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />

        <input
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />

        {err && <div className="text-red-400 text-sm">{err}</div>}

        <button className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}
