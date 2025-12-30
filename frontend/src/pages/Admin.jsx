import { useEffect, useState } from "react";
import { api } from "../api/http.js";

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [week, setWeek] = useState("2026-01-05");
  const [form, setForm] = useState({
    title: "",
    frequency: "weekly",
    difficulty: 3,
  });
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    setTasks(await api("/api/tasks"));
  }

  async function create() {
    const t = await api("/api/tasks", { method: "POST", body: form });
    setMsg("Task created");
    setForm({ title: "", frequency: "weekly", difficulty: 3 });
    setTasks((prev) => [...prev, t]);
  }

  async function remove(id) {
    await api(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((x) => x.task_id !== id));
  }

  async function assignRandom() {
    const rows = await api("/api/assignments/assign-random", {
      method: "POST",
      body: { week_start: week },
    });
    setMsg(`Assigned ${rows.length} tasks for week ${week}`);
  }

  useEffect(() => {
    load().catch((e) => setMsg(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="text-xl font-bold">Admin</div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="font-semibold">Create task</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="p-3 rounded-xl bg-slate-950 border border-slate-700"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <select
              className="p-3 rounded-xl bg-slate-950 border border-slate-700"
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            >
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
            </select>
            <input
              className="p-3 rounded-xl bg-slate-950 border border-slate-700"
              type="number"
              min="1"
              max="5"
              value={form.difficulty}
              onChange={(e) =>
                setForm({ ...form, difficulty: Number(e.target.value) })
              }
            />
          </div>
          <button
            className="px-4 py-3 rounded-xl bg-blue-600"
            onClick={() => create().catch((e) => setMsg(e.message))}
          >
            Create
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="font-semibold">Auto-assign (SQL function)</div>
          <div className="flex gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-300">Week start</label>
              <input
                className="p-3 rounded-xl bg-slate-950 border border-slate-700"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
              />
            </div>
            <button
              className="px-4 py-3 rounded-xl bg-emerald-600"
              onClick={() => assignRandom().catch((e) => setMsg(e.message))}
            >
              Assign Random
            </button>
          </div>
          {msg && <div className="text-sm text-emerald-300">{msg}</div>}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <div className="font-semibold mb-3">Tasks</div>
          <table className="w-full">
            <thead className="text-slate-300 text-sm">
              <tr>
                <th className="text-left py-2">Title</th>
                <th>Freq</th>
                <th>Diff</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.task_id} className="border-t border-slate-800">
                  <td className="py-2">{t.title}</td>
                  <td className="py-2 text-center">{t.frequency}</td>
                  <td className="py-2 text-center">{t.difficulty}</td>
                  <td className="py-2 text-right">
                    <button
                      className="px-3 py-2 rounded-xl bg-red-600"
                      onClick={() =>
                        remove(t.task_id).catch((e) => setMsg(e.message))
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-slate-400">
                    No tasks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
