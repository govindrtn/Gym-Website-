import { formatMembershipDate, getMembershipStatus } from "./membership";

function escapeHtmlCell(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function downloadGymReport(members) {
  const headers = [
    "Member ID",
    "Name",
    "Phone",
    "Address",
    "Plan",
    "Membership Start",
    "Membership Expiry",
    "Plan Status",
    "Trainer Required",
    "Attendance Status",
    "Last Visit",
    "Due Amount",
    "Due Date",
  ];
  const rows = members.map((member) => {
    const membershipStatus = getMembershipStatus(member);

    return [
      member.id,
      member.name,
      member.phone,
      member.address,
      member.plan,
      formatMembershipDate(member.membershipStartedAt),
      formatMembershipDate(member.membershipExpiresAt),
      membershipStatus.label,
      member.trainerRequired ? "Yes" : "No",
      member.checkedIn ? "Inside" : "Outside",
      member.lastVisit,
      member.dueAmount,
      member.dueDate,
    ];
  });
  const tableRows = [headers, ...rows]
    .map((row, index) => {
      const tag = index === 0 ? "th" : "td";

      return `<tr>${row.map((cell) => `<${tag}>${escapeHtmlCell(cell)}</${tag}>`).join("")}</tr>`;
    })
    .join("");
  const workbook = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; }
          th { background: #16a34a; color: #ffffff; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <table>${tableRows}</table>
      </body>
    </html>
  `;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = `silver-gym-report-${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}

export { downloadGymReport };
