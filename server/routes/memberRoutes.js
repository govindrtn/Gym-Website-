import { Router } from "express";
import { USER_ROLES } from "../constants/auth.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { Member } from "../models/Member.js";
import { createMembershipDates } from "../utils/dateUtils.js";
import { cleanDocument } from "../utils/entityUtils.js";

const router = Router();

const planCatalog = [
  { name: "1 Month", price: 999, months: 1 },
  { name: "3 Month", price: 2499, months: 3 },
  { name: "6 Month", price: 4499, months: 6 },
  { name: "1 Year", price: 7999, months: 12 },
];

async function getNextMemberId() {
  const members = await Member.find({}, { id: 1 });
  const nextNumber =
    members.reduce((maxNumber, member) => {
      const memberNumber = Number(String(member.id).replace("sg-", ""));

      return Number.isFinite(memberNumber) ? Math.max(maxNumber, memberNumber) : maxNumber;
    }, 100) + 1;

  return `sg-${nextNumber}`;
}

router.use(requireAuth);

router.get("/", async (request, response, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    response.json({
      members: members.map(cleanDocument),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireRole(USER_ROLES.ADMIN), async (request, response, next) => {
  try {
    const selectedPlan = planCatalog.find((plan) => plan.name === request.body.plan) || planCatalog[0];
    const membershipDates = createMembershipDates(selectedPlan.months);
    const member = await Member.create({
      id: await getNextMemberId(),
      name: String(request.body.name || "").trim(),
      plan: selectedPlan.name,
      phone: String(request.body.phone || "").trim(),
      address: String(request.body.address || "").trim(),
      trainerRequired: Boolean(request.body.trainerRequired),
      ...membershipDates,
      lastVisit: "New member",
      checkedIn: false,
      dueAmount: Number(selectedPlan.price || 0),
      dueDate: "New",
    });

    response.status(201).json({
      member: cleanDocument(member),
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/attendance", requireRole(USER_ROLES.ADMIN), async (request, response, next) => {
  try {
    const member = await Member.findOne({ id: request.params.id });

    if (!member) {
      return response.status(404).json({ message: "Member not found." });
    }

    member.checkedIn = !member.checkedIn;
    member.lastVisit = member.checkedIn ? "Just now" : member.lastVisit;

    await member.save();

    return response.json({
      member: cleanDocument(member),
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/due-paid", requireRole(USER_ROLES.ADMIN), async (request, response, next) => {
  try {
    const member = await Member.findOneAndUpdate(
      { id: request.params.id },
      { dueAmount: 0, dueDate: "Paid" },
      { returnDocument: "after" },
    );

    if (!member) {
      return response.status(404).json({ message: "Member not found." });
    }

    return response.json({
      member: cleanDocument(member),
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireRole(USER_ROLES.ADMIN), async (request, response, next) => {
  try {
    const member = await Member.findOneAndDelete({ id: request.params.id });

    if (!member) {
      return response.status(404).json({ message: "Member not found." });
    }

    return response.json({
      member: cleanDocument(member),
    });
  } catch (error) {
    return next(error);
  }
});

export { router as memberRoutes };
