import { pool } from "../db/pool.js";

export async function listTasks(req, res) {
  const familyId = req.user.familyId;
  if (!familyId)
    return res
      .status(400)
      .json({ error: "familyId missing (user not mapped?)" });

  const q = await pool.query(
    `SELECT task_id, title, frequency, difficulty, is_active
     FROM homeduty.task WHERE family_id=$1 ORDER BY task_id`,
    [familyId]
  );
  res.json(q.rows);
}

export async function createTask(req, res) {
  const familyId = req.user.familyId;
  const { title, frequency, difficulty, is_active = true } = req.body || {};
  if (!familyId || !title || !frequency || !difficulty) {
    return res
      .status(400)
      .json({ error: "title/frequency/difficulty required" });
  }

  const q = await pool.query(
    `INSERT INTO homeduty.task (family_id, title, frequency, difficulty, is_active)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING task_id, title, frequency, difficulty, is_active`,
    [familyId, title, frequency, difficulty, is_active]
  );
  res.status(201).json(q.rows[0]);
}

export async function updateTask(req, res) {
  const familyId = req.user.familyId;
  const id = Number(req.params.id);
  const { title, frequency, difficulty, is_active } = req.body || {};

  const q = await pool.query(
    `UPDATE homeduty.task
     SET title=COALESCE($3,title),
         frequency=COALESCE($4,frequency),
         difficulty=COALESCE($5,difficulty),
         is_active=COALESCE($6,is_active)
     WHERE task_id=$1 AND family_id=$2
     RETURNING task_id, title, frequency, difficulty, is_active`,
    [
      id,
      familyId,
      title ?? null,
      frequency ?? null,
      difficulty ?? null,
      is_active ?? null,
    ]
  );

  if (!q.rows[0]) return res.status(404).json({ error: "Task not found" });
  res.json(q.rows[0]);
}

export async function deleteTask(req, res) {
  const familyId = req.user.familyId;
  const id = Number(req.params.id);

  const q = await pool.query(
    `DELETE FROM homeduty.task
     WHERE task_id=$1 AND family_id=$2
     RETURNING task_id`,
    [id, familyId]
  );

  if (!q.rows[0]) return res.status(404).json({ error: "Task not found" });
  res.json({ ok: true });
}
