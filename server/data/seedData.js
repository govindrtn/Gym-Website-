import bcrypt from "bcryptjs";
import { DEMO_ACCOUNTS } from "../constants/auth.js";
import { Coach } from "../models/Coach.js";
import { Member } from "../models/Member.js";
import { User } from "../models/User.js";

const demoMembers = [
  {
    id: "sg-101",
    name: "Rohan Mehta",
    plan: "3 Month",
    phone: "+91 98765 11001",
    address: "Sector 62, Noida",
    trainerRequired: true,
    membershipStartedAt: "2026-04-01",
    membershipExpiresAt: "2026-07-01",
    lastVisit: "Today, 06:12",
    checkedIn: true,
    dueAmount: 0,
    dueDate: "Paid",
  },
  {
    id: "sg-102",
    name: "Ananya Verma",
    plan: "6 Month",
    phone: "+91 98765 11002",
    address: "Indirapuram, Ghaziabad",
    trainerRequired: true,
    membershipStartedAt: "2026-01-15",
    membershipExpiresAt: "2026-07-15",
    lastVisit: "Yesterday, 19:04",
    checkedIn: false,
    dueAmount: 1800,
    dueDate: "Jun 08",
  },
  {
    id: "sg-103",
    name: "Kabir Sethi",
    plan: "1 Month",
    phone: "+91 98765 11003",
    address: "Sector 63, Noida",
    trainerRequired: false,
    membershipStartedAt: "2026-04-25",
    membershipExpiresAt: "2026-05-25",
    lastVisit: "Today, 07:02",
    checkedIn: true,
    dueAmount: 900,
    dueDate: "Overdue",
  },
  {
    id: "sg-104",
    name: "Nisha Kapoor",
    plan: "1 Year",
    phone: "+91 98765 11004",
    address: "Vaishali, Ghaziabad",
    trainerRequired: false,
    membershipStartedAt: "2026-02-01",
    membershipExpiresAt: "2027-02-01",
    lastVisit: "Mon, 18:40",
    checkedIn: false,
    dueAmount: 0,
    dueDate: "Paid",
  },
  {
    id: "sg-105",
    name: "Arjun Rao",
    plan: "1 Month",
    phone: "+91 98765 11005",
    address: "Sector 18, Noida",
    trainerRequired: true,
    membershipStartedAt: "2026-05-04",
    membershipExpiresAt: "2026-06-04",
    lastVisit: "Fri, 08:15",
    checkedIn: false,
    dueAmount: 2400,
    dueDate: "Jun 12",
  },
];

const demoCoaches = [
  {
    id: "coach-101",
    name: "Aarav Malik",
    role: "Weight Training Coach",
    focus: "Free weights, machines, posture, beginner foundations",
    initials: "AM",
  },
  {
    id: "coach-102",
    name: "Meera Shah",
    role: "Weight Floor Assistant",
    focus: "Exercise setup, safe loading, machine guidance",
    initials: "MS",
  },
  {
    id: "coach-103",
    name: "Kabir Rao",
    role: "Form Check Coach",
    focus: "Technique correction, warm-up guidance, lifting basics",
    initials: "KR",
  },
];

async function seedInitialData() {
  const [userCount, memberCount, coachCount] = await Promise.all([
    User.countDocuments(),
    Member.countDocuments(),
    Coach.countDocuments(),
  ]);

  if (!userCount) {
    const users = await Promise.all(
      DEMO_ACCOUNTS.map(async (account) => ({
        name: account.name,
        email: account.email.toLowerCase(),
        passwordHash: await bcrypt.hash(account.password, 10),
        role: account.role,
      })),
    );

    await User.insertMany(users);
  }

  if (!memberCount) {
    await Member.insertMany(demoMembers);
  }

  if (!coachCount) {
    await Coach.insertMany(demoCoaches);
  }
}

export { demoCoaches, demoMembers, seedInitialData };
