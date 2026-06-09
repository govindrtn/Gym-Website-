import { Clock3, Dumbbell, Moon, SunMedium } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dayFilters } from "@/data/siteData";
import "./ScheduleSection.css";

function ScheduleSection({ selectedDay, setSelectedDay, filteredSchedule }) {
  return (
    <section id="schedule" className="section-block schedule-section">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <Badge appearance="light" variant="success" className="bg-emerald-400/15 text-emerald-100">
              Weight training timetable
            </Badge>
            <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
              Silver Gym stays open in two focused weight-training shifts.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-300 sm:text-base">
              Monday to Saturday: morning 5:00 AM to 10:30 AM, evening 5:00 PM to 11:00 PM. Current setup is weight training only.
            </p>
            <div className="schedule-shift-grid mt-7">
              <div className="schedule-shift-card">
                <SunMedium className="size-4 text-emerald-300" />
                <div>
                  <div className="text-sm font-semibold">Morning shift</div>
                  <div className="text-xs text-zinc-400">5:00 AM - 10:30 AM</div>
                </div>
              </div>
              <div className="schedule-shift-card">
                <Moon className="size-4 text-emerald-300" />
                <div>
                  <div className="text-sm font-semibold">Evening shift</div>
                  <div className="text-xs text-zinc-400">5:00 PM - 11:00 PM</div>
                </div>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter schedule by day">
              {dayFilters.map((day) => (
                <Button
                  key={day}
                  size="sm"
                  variant={selectedDay === day ? "primary" : "outline"}
                  aria-pressed={selectedDay === day}
                  className={
                    selectedDay === day
                      ? ""
                      : "border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
                  }
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          <Card className="schedule-card">
            <div className="divide-y divide-white/10">
              {filteredSchedule.map((item) => (
                <div
                  key={`${item.day}-${item.time}-${item.name}`}
                  className="schedule-row grid gap-3 p-4 sm:grid-cols-[72px_128px_1fr_auto] sm:items-center"
                >
                  <Badge appearance="light" variant="success" className="w-fit bg-white/10 text-emerald-100">
                    {item.day}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Clock3 className="size-4 text-emerald-300" />
                    {item.time}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Dumbbell className="size-4 text-emerald-300" />
                      {item.name}
                    </div>
                    <div className="text-sm text-zinc-400">{item.coach}</div>
                  </div>
                  <Badge variant="outline" className="w-fit border-white/10 text-zinc-200">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export { ScheduleSection };
