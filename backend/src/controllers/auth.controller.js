import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";

function parseUsers() {
  const raw = process.env.APP_USERS || "";
  const map = new Map();
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((item) => {
      const [email, password, role] = item.split(":").map((x) => x.trim());
      if (email && password && role)
        map.set(email.toLowerCase(), { password, role });
    });
  return map;
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "email/password required" });

  const users = parseUsers();
  const u = users.get(String(email).toLowerCase());
  if (!u || u.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });

  // map to DB app_user row
  let userId = null,
    familyId = null;
  const q = await pool.query(
    "SELECT user_id, family_id FROM homeduty.app_user WHERE lower(email)=lower($1) LIMIT 1",
    [email]
  );
  if (q.rows[0]) {
    userId = q.rows[0].user_id;
    familyId = q.rows[0].family_id;
  }

  const token = jwt.sign(
    { email, role: u.role, userId, familyId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: { email, role: u.role, userId, familyId } });
}
