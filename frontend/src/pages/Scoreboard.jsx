import { useState } from "react";
import { api } from "../api/http.js";

export default function Scoreboard() {
  const [week, setWeek] = useState("2026-01-05");
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setRows(await api(`/api/reports/scoreboard?week=${week}`));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="text-xl font-bold">Scoreboard (VIEW)</div>
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
            onClick={() => load().catch((e) => setErr(e.message))}
          >
            Load
          </button>
          {err && <div className="text-sm text-red-400">{err}</div>}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
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
              {rows.map((r) => (
                <tr key={r.user_id} className="border-t border-slate-800">
                  <td className="py-2">{r.full_name}</td>
                  <td className="py-2 text-center">{r.total_points}</td>
                  <td className="py-2 text-center">{r.done_count}</td>
                  <td className="py-2 text-center">{r.missed_count}</td>
                </tr>
              ))}
              {rows.length === 0 && (
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
