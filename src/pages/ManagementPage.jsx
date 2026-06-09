import { ManagementSection } from "@/components/site/ManagementSection";

function ManagementPage({
  members,
  addMember,
  removeMember,
  toggleAttendance,
  markDuePaid,
}) {
  return (
    <ManagementSection
      members={members}
      addMember={addMember}
      removeMember={removeMember}
      toggleAttendance={toggleAttendance}
      markDuePaid={markDuePaid}
    />
  );
}

export default ManagementPage;
