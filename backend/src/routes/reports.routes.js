import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  scoreboard,
  activity,
  pending,
  familyCursor,
} from "../controllers/reports.controller.js";

const r = Router();
r.get("/scoreboard", requireAuth, scoreboard);
r.get("/activity", requireAuth, activity);
r.get("/pending", requireAuth, pending);
r.get("/family-cursor", requireAuth, familyCursor);
export default r;
