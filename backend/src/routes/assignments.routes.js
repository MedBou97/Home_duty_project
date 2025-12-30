import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  listMine,
  updateStatus,
  assignRandom,
} from "../controllers/assignments.controller.js";

const r = Router();
r.get("/mine", requireAuth, listMine);
r.patch("/:id/status", requireAuth, updateStatus);
r.post("/assign-random", requireAuth, requireRole("admin"), assignRandom);
export default r;
