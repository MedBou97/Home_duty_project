import { useState } from "react";
import { api } from "../api/http.js";

export default function Insights() {
  const [week, setWeek] = useState("2026-01-05");
  const [pending, setPending] = useState([]);
  const [activity, setActivity] = useState([]);
  const [cursorRows, setCursorRows] = useState([]);
  const [minPoints, setMinPoints] = useState(0);
  const [err, setErr] = useState("");

  async function loadPending() {
    setErr("");
    setPending(await api(`/api/reports/pending?week=${week}`)); // EXCEPT function
  }
  async function loadActivity() {
    setErr("");
    setActivity(await api(`/api/reports/activity?week=${week}`)); // UNION view
  }
  async function loadCursor() {
    setErr("");
    setCursorRows(
      await api(
        `/api/reports/family-cursor?week=${week}&minPoints=${minPoints}`
      )
    ); // cursor+record
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="text-xl font-bold">Insights</div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex gap-3 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-300">Week start</label>
            <input
              className="p-3 rounded-xl bg-slate-950 border border-slate-700"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-300">
              Min points (HAVING)
            </label>
            <input
              className="p-3 rounded-xl bg-slate-950 border border-slate-700"
              type="number"
              value={minPoints}
              onChange={(e) => setMinPoints(Number(e.target.value))}
            />
          </div>

          <button
            className="px-4 py-3 rounded-xl bg-blue-600"
            onClick={() => loadPending().catch((e) => setErr(e.message))}
          >
            Pending (EXCEPT)
          </button>
          <button
            className="px-4 py-3 rounded-xl bg-emerald-600"
            onClick={() => loadActivity().catch((e) => setErr(e.message))}
          >
            Activity (UNION)
          </button>
          <button
            className="px-4 py-3 rounded-xl bg-purple-600"
            onClick={() => loadCursor().catch((e) => setErr(e.message))}
          >
            Family Cursor
          </button>

          {err && <div className="text-sm text-red-400">{err}</div>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
            <div className="font-semibold mb-2">Pending tasks (EXCEPT)</div>
            {pending.map((p) => (
              <div key={p.task_id} className="py-1 text-slate-200">
                {p.task_title}{" "}
                <span className="text-slate-400">(diff {p.difficulty})</span>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="text-slate-400">No data.</div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
            <div className="font-semibold mb-2">Activity feed (UNION)</div>
            {activity.slice(0, 10).map((a) => (
              <div key={a.assignment_id} className="py-1">
                <span className="text-slate-200">{a.full_name}</span> •{" "}
                {a.task_title} •
                <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-800 text-xs">
                  {a.event_type}
                </span>
              </div>
            ))}
            {activity.length === 0 && (
              <div className="text-slate-400">No data.</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <div className="font-semibold mb-2">
            Family scoreboard (cursor + record + HAVING)
          </div>
          <table className="w-full">
            <thead className="text-slate-300 text-sm">
              <tr>
                <th className="text-left py-2">Name</th>
                <th>Points</th>
                <th>Done</th>
                <th>Missed</th>
              </tr>
            </thead>
            <tbody>
              {cursorRows.map((r) => (
                <tr key={r.user_id} className="border-t border-slate-800">
                  <td className="py-2">{r.full_name}</td>
                  <td className="py-2 text-center">{r.total_points}</td>
                  <td className="py-2 text-center">{r.done_count}</td>
                  <td className="py-2 text-center">{r.missed_count}</td>
                </tr>
              ))}
              {cursorRows.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-slate-400">
                    No data.
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
