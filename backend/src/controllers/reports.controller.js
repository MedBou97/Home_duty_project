import { pool } from "../db/pool.js";

export async function scoreboard(req, res) {
  const familyId = req.user.familyId;
  const week = req.query.week;
  if (!familyId || !week)
    return res.status(400).json({ error: "week required" });

  const q = await pool.query(
    `SELECT * FROM homeduty.vw_weekly_scoreboard
     WHERE family_id=$1 AND week_start=$2
     ORDER BY total_points DESC, full_name`,
    [familyId, week]
  );
  res.json(q.rows);
}

export async function activity(req, res) {
  const familyId = req.user.familyId;
  const week = req.query.week;
  if (!familyId || !week)
    return res.status(400).json({ error: "week required" });

  const q = await pool.query(
    `SELECT * FROM homeduty.vw_week_activity_feed
     WHERE family_id=$1 AND week_start=$2
     ORDER BY assignment_id`,
    [familyId, week]
  );
  res.json(q.rows);
}

export async function pending(req, res) {
  const userId = req.user.userId;
  const week = req.query.week;
  if (!userId || !week) return res.status(400).json({ error: "week required" });

  const q = await pool.query(
    `SELECT * FROM homeduty.get_user_pending_tasks($1,$2)`,
    [userId, week]
  );
  res.json(q.rows);
}

export async function familyCursor(req, res) {
  const familyId = req.user.familyId;
  const week = req.query.week;
  const minPoints = Number(req.query.minPoints ?? 0);
  if (!familyId || !week)
    return res.status(400).json({ error: "week required" });

  const q = await pool.query(
    `SELECT * FROM homeduty.get_family_scoreboard_cursor($1,$2,$3)`,
    [familyId, week, minPoints]
  );
  res.json(q.rows);
}
