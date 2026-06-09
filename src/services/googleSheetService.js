const GOOGLE_SHEET_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
const SYNC_SOURCE = "silver-gym-website";

export function hasGoogleSheetWebhook() {
  return Boolean(GOOGLE_SHEET_WEBHOOK_URL);
}

export async function syncGoogleSheetAction(action, payload = {}) {
  if (!hasGoogleSheetWebhook()) {
    return {
      ok: false,
      skipped: true,
      reason: "VITE_GOOGLE_SHEET_WEBHOOK_URL is not configured.",
    };
  }

  try {
    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action,
        payload,
        source: SYNC_SOURCE,
        sentAt: new Date().toISOString(),
      }),
    });

    return {
      ok: true,
      queued: true,
    };
  } catch (error) {
    console.warn("Google Sheet sync failed", error);

    return {
      ok: false,
      error,
    };
  }
}
