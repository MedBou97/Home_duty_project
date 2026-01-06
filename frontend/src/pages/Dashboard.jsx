import { useEffect, useState } from "react";
import { api } from "../api/http.js";
import { getUser, logout } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const user = getUser();
  const nav = useNavigate();
  const [week, setWeek] = useState("2026-01-05");
  const [rows, setRows] = useState([]);

  async function load() {
    try {
      const data = await api(`/api/assignments/mine?week=${week}`);
      setRows(data);
    } catch (e) {
      toast.error(e.message || "Failed to load assignments");
    }
  }

  async function markDone(id) {
    try {
      const r = await api(`/api/assignments/${id}/status`, {
        method: "PATCH",
        body: { status: "done" },
      });

      const parts = [];
      if (r.triggerMessage) parts.push(r.triggerMessage);
      if (r.badge) parts.push(`New badge: ${r.badge}`);
      if (typeof r.pointsTotal === "number")
        parts.push(`Total points: ${r.pointsTotal}`);

      toast.success(parts.length ? parts.join(" • ") : "Marked as done");

      await load();
    } catch (e) {
      toast.error(e.message || "Failed to update status");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">Dashboard</div>
            <div className="text-sm text-slate-300">
              {user.email} • {user.role}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-xl bg-slate-800"
              onClick={() => nav("/scoreboard")}
            >
              Scoreboard
            </button>
            <button
              className="px-3 py-2 rounded-xl bg-slate-800"
              onClick={() => nav("/insights")}
            >
              Insights
            </button>
            {user.role === "admin" && (
              <button
                className="px-3 py-2 rounded-xl bg-slate-800"
                onClick={() => nav("/admin")}
              >
                Admin
              </button>
            )}
            <button
              className="px-3 py-2 rounded-xl bg-red-600"
              onClick={() => {
                logout();
                nav("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-300">Week start</label>
            <input
              className="p-3 rounded-xl bg-slate-950 border border-slate-700"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-3 rounded-xl bg-blue-600"
            onClick={() => load()}
          >
            Load
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <table className="w-full">
            <thead className="text-slate-300 text-sm">
              <tr>
                <th className="text-left py-2">Task</th>
                <th className="text-left py-2">Difficulty</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.assignment_id} className="border-t border-slate-800">
                  <td className="py-2">{r.task_title}</td>
                  <td className="py-2">{r.difficulty}</td>
                  <td className="py-2">{r.status}</td>
                  <td className="py-2">{r.points_awarded}</td>
                  <td className="py-2 text-right">
                    {r.status !== "done" && (
                      <button
                        className="px-3 py-2 rounded-xl bg-emerald-600"
                        onClick={() => markDone(r.assignment_id)}
                      >
                        Mark done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-4 text-slate-400" colSpan="5">
                    No assignments for this week.
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
