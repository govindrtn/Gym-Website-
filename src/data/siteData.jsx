import {
  Activity,
  Dumbbell,
  Flame,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { USER_ROLES } from "@/constants";

export const brand = {
  name: "Silver Gym",
  mark: "S",
  phone: "+91 88782 57808 / +91 86024 43526",
  phoneHref: "tel:+918878257808",
  whatsappNumbers: [
    { label: "88782 57808", number: "918878257808" },
    { label: "86024 43526", number: "918602443526" },
  ],
  email: "hello@silvergym.com",
  location: "Ratatalai, Main Road, Salamatpur, Raisen - 464651 (near the Police Station)",
  hours: "Mon-Sat, 5:30 AM - 10:00 PM",
};

export const navItems = [
  { label: "Home", href: "/", roles: [USER_ROLES.ADMIN, USER_ROLES.USER] },
  { label: "Training", href: "/training", roles: [USER_ROLES.ADMIN, USER_ROLES.USER] },
  { label: "Timetable", href: "/timetable", roles: [USER_ROLES.ADMIN, USER_ROLES.USER] },
  { label: "Calories", href: "/calories", roles: [USER_ROLES.ADMIN, USER_ROLES.USER] },
  { label: "Members", href: "/management", roles: [USER_ROLES.ADMIN] },
  { label: "Coaches", href: "/coaches", roles: [USER_ROLES.ADMIN, USER_ROLES.USER] },
  { label: "Plans", href: "/plans", roles: [USER_ROLES.ADMIN, USER_ROLES.USER] },
  { label: "Enquiry", href: "/contact", roles: [USER_ROLES.ADMIN, USER_ROLES.USER] },
];

export const metrics = [
  { value: 42, label: "weekly sessions" },
  { value: 18, label: "certified coaches" },
  { value: 4.9, label: "member rating", decimals: 1 },
  { display: "24/7", label: "club access" },
];

export const programs = [
  {
    title: "Strength Lab",
    description: "Barbell coaching, progressive overload, and clean movement standards.",
    icon: Dumbbell,
    tag: "Build",
    tone: "success",
  },
  {
    title: "Engine Room",
    description: "Conditioning blocks built around sleds, rowers, bikes, and intervals.",
    icon: Zap,
    tag: "Sweat",
    tone: "warning",
  },
  {
    title: "Mobility Reset",
    description: "Guided recovery, assisted stretching, breathwork, and joint prep.",
    icon: HeartPulse,
    tag: "Recover",
    tone: "info",
  },
  {
    title: "Small Group PT",
    description: "Focused coaching in compact groups with measurable weekly targets.",
    icon: Users,
    tag: "Coach",
    tone: "primary",
  },
];

export const clubPillars = [
  {
    title: "Coach-first floor",
    description: "Every block starts with movement standards, scaling options, and hands-on feedback.",
    icon: ShieldCheck,
    meta: "1:12 cap",
  },
  {
    title: "Hybrid training",
    description: "Racks, sleds, rowers, bikes, and open turf keep strength and conditioning connected.",
    icon: Dumbbell,
    meta: "8 zones",
  },
  {
    title: "Recovery built in",
    description: "Mobility work, cooldowns, and recovery guidance are part of the weekly training rhythm.",
    icon: HeartPulse,
    meta: "Reset room",
  },
];

export const trainingFlow = [
  {
    value: "10 min",
    label: "Movement screen",
    detail: "A coach checks positions, injury history, and training level before loading work.",
  },
  {
    value: "45 min",
    label: "Structured session",
    detail: "Strength, engine, or recovery blocks are coached with clear intent and progressions.",
  },
  {
    value: "5 min",
    label: "Next-step review",
    detail: "You leave with the next class target, recovery note, or technique cue to focus on.",
  },
];

export const schedule = [
  { day: "Mon", time: "05:00-10:30", name: "Morning Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Mon", time: "17:00-23:00", name: "Evening Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Tue", time: "05:00-10:30", name: "Morning Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Tue", time: "17:00-23:00", name: "Evening Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Wed", time: "05:00-10:30", name: "Morning Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Wed", time: "17:00-23:00", name: "Evening Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Thu", time: "05:00-10:30", name: "Morning Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Thu", time: "17:00-23:00", name: "Evening Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Fri", time: "05:00-10:30", name: "Morning Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Fri", time: "17:00-23:00", name: "Evening Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Sat", time: "05:00-10:30", name: "Morning Weight Training", coach: "Open floor", type: "Weight Training" },
  { day: "Sat", time: "17:00-23:00", name: "Evening Weight Training", coach: "Open floor", type: "Weight Training" },
];

export const coaches = [
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

export const coachHighlights = [
  { icon: Activity, label: "Movement screening" },
  { icon: Flame, label: "Intensity scaling" },
  { icon: Sparkles, label: "Recovery guidance" },
  { icon: ShieldCheck, label: "Form-first training" },
];

export const plans = [
  {
    name: "1 Month",
    price: "999",
    cadence: "month",
    months: 1,
    note: "Short-term weight training access",
    fitScore: 58,
    features: ["Weight training floor", "Machine access", "Basic form guidance"],
  },
  {
    name: "3 Month",
    price: "2499",
    cadence: "3 months",
    months: 3,
    note: "Best for consistent strength progress",
    featured: true,
    fitScore: 84,
    features: ["Weight training floor", "Progress tracking", "Trainer preference support"],
  },
  {
    name: "6 Month",
    price: "4499",
    cadence: "6 months",
    months: 6,
    note: "Longer commitment with better value",
    fitScore: 96,
    features: ["Weight training floor", "Routine guidance", "Priority renewal reminder"],
  },
  {
    name: "1 Year",
    price: "7999",
    cadence: "year",
    months: 12,
    note: "Maximum value for serious members",
    fitScore: 100,
    features: ["Full-year weight training", "Renewal support", "Best monthly value"],
  },
];

export const dayFilters = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const todaySessions = [
  { time: "06:00", name: "Strength Foundation", coach: "Aarav" },
  { time: "07:30", name: "Athletic Flow", coach: "Meera" },
  { time: "19:00", name: "Engine Intervals", coach: "Nisha" },
];

export const gymMembers = [
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
