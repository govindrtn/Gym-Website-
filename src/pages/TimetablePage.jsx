import { ScheduleSection } from "@/components/site/ScheduleSection";

function TimetablePage({ filteredSchedule, selectedDay, setSelectedDay }) {
  return (
    <ScheduleSection
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      filteredSchedule={filteredSchedule}
    />
  );
}

export default TimetablePage;
