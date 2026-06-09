const DEFAULT_HEADERS = ["Received At", "Action", "Payload", "Source", "Sent At"];
const SHEET_BY_ACTION = {
  attendance_updated: "Attendance",
  contact_trial: "Enquiries",
  coach_added: "Coaches",
  coach_removed: "Coach Logs",
  demo_reset: "System Logs",
  due_paid: "Payments",
  member_added: "Members",
  member_removed: "Member Logs",
};

function doPost(event) {
  const requestBody = parseBody_(event);
  const action = requestBody.action || "unknown_action";
  const payload = requestBody.payload || {};
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet_(spreadsheet, SHEET_BY_ACTION[action] || "System Logs");

  sheet.appendRow([
    new Date(),
    action,
    JSON.stringify(payload),
    requestBody.source || "silver-gym-website",
    requestBody.sentAt || "",
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function parseBody_(event) {
  try {
    return JSON.parse(event.postData.contents || "{}");
  } catch (error) {
    return {
      action: "invalid_payload",
      payload: {
        message: error.message,
      },
    };
  }
}

function getSheet_(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(DEFAULT_HEADERS);
  }

  return sheet;
}
