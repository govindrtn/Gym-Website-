import { Router } from "express";
import { USER_ROLES } from "../constants/auth.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { Coach } from "../models/Coach.js";
import { cleanDocument, getInitials } from "../utils/entityUtils.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (request, response, next) => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });

    response.json({
      coaches: coaches.map(cleanDocument),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireRole(USER_ROLES.ADMIN), async (request, response, next) => {
  try {
    const name = String(request.body.name || "").trim();
    const coach = await Coach.create({
      id: `coach-${Date.now()}`,
      name,
      role: String(request.body.role || "").trim(),
      focus: String(request.body.focus || "").trim(),
      initials: getInitials(name),
    });

    response.status(201).json({
      coach: cleanDocument(coach),
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireRole(USER_ROLES.ADMIN), async (request, response, next) => {
  try {
    const coach = await Coach.findOneAndDelete({ id: request.params.id });

    if (!coach) {
      return response.status(404).json({ message: "Coach not found." });
    }

    return response.json({
      coach: cleanDocument(coach),
    });
  } catch (error) {
    return next(error);
  }
});

export { router as coachRoutes };
