import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  patchHabit,
  deleteHabit
} from "../controllers/habit.controller";

const router = Router();

// All routes require authentication
router.post("/", protectedRoute, createHabit);
router.get("/", protectedRoute, getHabits);
router.get("/:id", protectedRoute, getHabitById);
router.put("/:id", protectedRoute, updateHabit);
router.patch("/:id", protectedRoute, patchHabit);
router.delete("/:id", protectedRoute, deleteHabit);

export default router;

