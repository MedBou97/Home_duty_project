import { useEffect, useState } from "react";
import { api } from "../api/http.js";
import BackToDashboard from "../components/BackToDashboard.jsx";

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [week, setWeek] = useState("2026-01-05");

  const emptyForm = {
    title: "",
    frequency: "weekly",
    difficulty: 3,
    is_active: true,
  };
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null); // <-- NEW
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    setTasks(await api("/api/tasks"));
  }

  async function create() {
    const created = await api("/api/tasks", { method: "POST", body: form });
    setMsg("Task created ✅");
    setForm(emptyForm);
    setTasks((prev) => [...prev, created]);
  }

  async function startEdit(task) {
    setEditingId(task.task_id);
    setForm({
      title: task.title,
      frequency: task.frequency,
      difficulty: task.difficulty,
      is_active: task.is_active,
    });
    setMsg(`Editing: ${task.title}`);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMsg("Edit canceled");
  }

  async function update() {
    const updated = await api(`/api/tasks/${editingId}`, {
      method: "PUT",
      body: form,
    });

    setMsg("Task updated ✅");
    setEditingId(null);
    setForm(emptyForm);

    setTasks((prev) =>
      prev.map((t) => (t.task_id === updated.task_id ? updated : t))
    );
  }

  async function remove(id) {
    await api(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((x) => x.task_id !== id));
    setMsg("Task deleted ✅");
  }

  async function assignRandom() {
    const rows = await api("/api/assignments/assign-random", {
      method: "POST",
      body: { week_start: week },
    });
    setMsg(`Assigned ${rows.length} tasks for week ${week} ✅`);
  }

  useEffect(() => {
    load().catch((e) => setMsg(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex justify-between mt-5">
          <BackToDashboard />
          <p className="text-2xl font-bold pt-2">Admin</p>
        </div>

        {/* Create / Update form */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="font-semibold">
            {editingId ? "Update task (UPDATE)" : "Create task (INSERT)"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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

            <select
              className="p-3 rounded-xl bg-slate-950 border border-slate-700"
              value={String(form.is_active)}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.value === "true" })
              }
            >
              <option value="true">active</option>
              <option value="false">inactive</option>
            </select>
          </div>

          <div className="flex gap-2">
            {!editingId ? (
              <button
                className="px-4 py-3 rounded-xl bg-blue-600"
                onClick={() => create().catch((e) => setMsg(e.message))}
              >
                Create
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-3 rounded-xl bg-emerald-600"
                  onClick={() => update().catch((e) => setMsg(e.message))}
                >
                  Update
                </button>
                <button
                  className="px-4 py-3 rounded-xl bg-slate-800"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {msg && <div className="text-sm text-emerald-300">{msg}</div>}
        </div>

        {/* Auto assign */}
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
        </div>

        {/* Tasks table */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <div className="font-semibold mb-3">Tasks</div>
          <table className="w-full">
            <thead className="text-slate-300 text-sm">
              <tr>
                <th className="text-left py-2">Title</th>
                <th className="text-center">Freq</th>
                <th className="text-center">Diff</th>
                <th className="text-center">Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...tasks].reverse().map((t) => (
                <tr key={t.task_id} className="border-t border-slate-800">
                  <td className="py-2">{t.title}</td>
                  <td className="py-2 text-center">{t.frequency}</td>
                  <td className="py-2 text-center">{t.difficulty}</td>
                  <td className="py-2 text-center">
                    {t.is_active ? "yes" : "no"}
                  </td>
                  <td className="py-2 text-right flex gap-2 justify-end">
                    <button
                      className="px-3 py-2 rounded-xl bg-slate-800"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
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
                  <td colSpan="5" className="py-4 text-slate-400">
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
