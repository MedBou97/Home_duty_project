import { pool } from "../db/pool.js";

export async function listMine(req, res) {
  const userId = req.user.userId;
  const week = req.query.week;
  if (!userId || !week)
    return res.status(400).json({ error: "week required + mapped user" });

  const q = await pool.query(
    `SELECT a.assignment_id, a.week_start, a.status, a.points_awarded, a.last_trigger_msg,
            t.title AS task_title, t.difficulty
     FROM homeduty.assignment a
     JOIN homeduty.task t ON t.task_id=a.task_id
     WHERE a.assigned_to=$1 AND a.week_start=$2
     ORDER BY a.assignment_id`,
    [userId, week]
  );
  res.json(q.rows);
}

export async function updateStatus(req, res) {
  const userId = req.user.userId;
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!userId || !id || !status)
    return res.status(400).json({ error: "status required" });

  const q = await pool.query(
    `UPDATE homeduty.assignment
     SET status=$3
     WHERE assignment_id=$1 AND assigned_to=$2
     RETURNING assignment_id, status, points_awarded, last_trigger_msg`,
    [id, userId, status]
  );
  if (!q.rows[0])
    return res.status(404).json({ error: "Not found (or not yours)" });

  // fetch badge + points_total to prove Trigger #2 ran
  const u = await pool.query(
    `SELECT badge, points_total
     FROM homeduty.app_user
     WHERE user_id=$1`,
    [userId]
  );

  const badge = u.rows[0]?.badge ?? null;
  const pointsTotal = u.rows[0]?.points_total ?? null;

  res.json({
    ...q.rows[0],
    triggerMessage: q.rows[0].last_trigger_msg || null,
    badge,
    pointsTotal,
  });
}

export async function assignRandom(req, res) {
  const familyId = req.user.familyId;
  const { week_start } = req.body || {};
  if (!familyId || !week_start)
    return res.status(400).json({ error: "week_start required" });

  const q = await pool.query(
    `SELECT * FROM homeduty.assign_tasks_random($1,$2)`,
    [familyId, week_start]
  );
  res.json(q.rows);
}
