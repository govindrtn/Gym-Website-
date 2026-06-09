import { CoachesSection } from "@/components/site/CoachesSection";

function CoachesPage({ currentUser, coaches, addCoach, removeCoach }) {
  return (
    <CoachesSection
      currentUser={currentUser}
      coaches={coaches}
      addCoach={addCoach}
      removeCoach={removeCoach}
    />
  );
}

export default CoachesPage;
