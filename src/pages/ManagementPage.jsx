import { ManagementSection } from "@/components/site/ManagementSection";

function ManagementPage({
  members,
  addMember,
  removeMember,
  toggleAttendance,
  markDuePaid,
  resetDemoData,
}) {
  return (
    <ManagementSection
      members={members}
      addMember={addMember}
      removeMember={removeMember}
      toggleAttendance={toggleAttendance}
      markDuePaid={markDuePaid}
      resetDemoData={resetDemoData}
    />
  );
}

export default ManagementPage;
