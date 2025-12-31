import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";

const r = Router();
r.get("/", requireAuth, listTasks);
r.post("/", requireAuth, requireRole("admin"), createTask);
r.put("/:id", requireAuth, requireRole("admin"), updateTask);
r.delete("/:id", requireAuth, requireRole("admin"), deleteTask);
export default r;
