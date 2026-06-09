import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { Enquiry } from "../models/Enquiry.js";
import { cleanDocument } from "../utils/entityUtils.js";

const router = Router();

router.post("/", requireAuth, async (request, response, next) => {
  try {
    const enquiry = await Enquiry.create({
      name: String(request.body.name || "").trim(),
      phone: String(request.body.phone || "").trim(),
      email: String(request.body.email || "").trim(),
      goal: String(request.body.goal || "").trim(),
      notes: String(request.body.notes || "").trim(),
      selectedPlan: String(request.body.selectedPlan || request.body.membership || "").trim(),
      message: String(request.body.message || "").trim(),
    });

    response.status(201).json({
      enquiry: cleanDocument(enquiry),
    });
  } catch (error) {
    next(error);
  }
});

export { router as enquiryRoutes };
