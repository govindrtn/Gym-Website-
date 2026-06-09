import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { USER_ROLES } from "../constants/auth.js";
import { Coach } from "../models/Coach.js";
import { Member } from "../models/Member.js";
import { User } from "../models/User.js";

const DEMO_CLEANUP_MIGRATION = "remove-demo-records-v1";
const DEMO_MEMBER_IDS = ["sg-101", "sg-102", "sg-103", "sg-104", "sg-105"];
const DEMO_COACH_IDS = ["coach-101", "coach-102", "coach-103"];

async function removeExistingDemoData() {
  const migrations = mongoose.connection.collection("app_migrations");
  const migration = await migrations.findOne({ _id: DEMO_CLEANUP_MIGRATION });

  if (migration) {
    return;
  }

  await Promise.all([
    Member.deleteMany({ id: { $in: DEMO_MEMBER_IDS } }),
    Coach.deleteMany({ id: { $in: DEMO_COACH_IDS } }),
    User.deleteMany({ email: "member@silvergym.com", role: USER_ROLES.USER }),
  ]);
  await migrations.insertOne({
    _id: DEMO_CLEANUP_MIGRATION,
    completedAt: new Date(),
  });

  console.log("Removed existing Silver Gym demo records.");
}

async function ensureAdminUser() {
  const existingAdmin = await User.exists({ role: USER_ROLES.ADMIN });

  if (existingAdmin) {
    return;
  }

  const name = String(process.env.ADMIN_NAME || "Silver Gym Admin").trim();
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email || password.length < 8) {
    console.warn(
      "No admin user exists. Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 8 characters) to create one.",
    );
    return;
  }

  await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: USER_ROLES.ADMIN,
  });

  console.log(`Created admin user: ${email}`);
}

async function initializeDatabase() {
  await removeExistingDemoData();
  await ensureAdminUser();
}

export { initializeDatabase };
