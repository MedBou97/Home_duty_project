import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import assignmentsRoutes from "./routes/assignments.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

export const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like curl/postman (no Origin header)
      if (!origin) return callback(null, true);

      // if env var is empty, you can decide default behavior:
      // safest: block by default
      if (allowedOrigins.length === 0)
        return callback(new Error("CORS blocked"), false);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true, // only if you use cookies/auth with credentials
  })
);

app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/reports", reportsRoutes);
