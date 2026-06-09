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

export { createMembershipDates, toIsoDate };
