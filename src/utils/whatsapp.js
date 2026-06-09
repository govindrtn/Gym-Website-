function getFormValue(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function createTrialWhatsAppMessage(formData, fallbackPlan) {
  const name = getFormValue(formData, "name");
  const phone = getFormValue(formData, "phone");
  const email = getFormValue(formData, "email");
  const goal = getFormValue(formData, "goal");
  const notes = getFormValue(formData, "notes");
  const membership = getFormValue(formData, "membership") || fallbackPlan;

  return [
    "New Silver Gym trial enquiry",
    `Name: ${name || "Not shared"}`,
    `Phone: ${phone || "Not shared"}`,
    `Email: ${email || "Not shared"}`,
    `Selected plan: ${membership || "Not selected"}`,
    goal && `Goal: ${goal}`,
    notes && `Notes: ${notes}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function createWhatsAppUrl(phoneNumber, message) {
  const cleanPhoneNumber = String(phoneNumber ?? "").replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message ?? "");

  return `https://wa.me/${cleanPhoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

export { createTrialWhatsAppMessage, createWhatsAppUrl };
