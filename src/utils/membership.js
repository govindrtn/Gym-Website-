const EXPIRING_SOON_DAYS = 7;

function toDateOnly(date) {
  const normalizedDate = new Date(date);

  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
}

function toIsoDate(date) {
  return toDateOnly(date).toISOString().slice(0, 10);
}

function addMonths(date, months) {
  const nextDate = toDateOnly(date);
  const day = nextDate.getDate();

  nextDate.setMonth(nextDate.getMonth() + months);

  if (nextDate.getDate() !== day) {
    nextDate.setDate(0);
  }

  return nextDate;
}

function createMembershipDates(months, startDate = new Date()) {
  const start = toDateOnly(startDate);

  return {
    membershipStartedAt: toIsoDate(start),
    membershipExpiresAt: toIsoDate(addMonths(start, months)),
  };
}

function getDaysUntilExpiry(member, today = new Date()) {
  if (!member.membershipExpiresAt) {
    return 0;
  }

  const expiryDate = toDateOnly(member.membershipExpiresAt);
  const currentDate = toDateOnly(today);
  const diffMs = expiryDate.getTime() - currentDate.getTime();

  return Math.ceil(diffMs / 86400000);
}

function getMembershipStatus(member, today = new Date()) {
  const daysUntilExpiry = getDaysUntilExpiry(member, today);

  if (daysUntilExpiry < 0) {
    return {
      label: "Expired",
      tone: "warning",
      value: "expired",
      daysUntilExpiry,
    };
  }

  if (daysUntilExpiry <= EXPIRING_SOON_DAYS) {
    return {
      label: "Expiring soon",
      tone: "warning",
      value: "expiring",
      daysUntilExpiry,
    };
  }

  return {
    label: "Active",
    tone: "success",
    value: "active",
    daysUntilExpiry,
  };
}

function formatMembershipDate(dateValue) {
  if (!dateValue) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(toDateOnly(dateValue));
}

export {
  createMembershipDates,
  formatMembershipDate,
  getDaysUntilExpiry,
  getMembershipStatus,
  toIsoDate,
};
