import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { USER_ROLES } from "@/constants";
import { coachHighlights } from "@/data/siteData";
import { SectionIntro } from "./SectionIntro";
import "./CoachesSection.css";

const initialCoachForm = {
  name: "",
  role: "Weight Training Coach",
  focus: "",
};

function CoachesSection({ currentUser, coaches = [], addCoach, removeCoach }) {
  const [coachForm, setCoachForm] = useState(initialCoachForm);
  const [coachAdded, setCoachAdded] = useState(false);
  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;

  function updateCoachForm(field, value) {
    setCoachAdded(false);
    setCoachForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleAddCoach(event) {
    event.preventDefault();

    const saved = await addCoach({
      name: coachForm.name.trim(),
      role: coachForm.role.trim(),
      focus: coachForm.focus.trim(),
    });

    if (!saved) {
      setCoachAdded(false);
      return;
    }

    setCoachForm(initialCoachForm);
    setCoachAdded(true);
  }

  return (
    <section id="coaches" className="section-block">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionIntro
              align="left"
              badge="Coaching bench"
              title="Weight training floor needs clear instruction."
              description="Admin can manage the coach bench. Members see the current weight-training coaches available at Silver Gym."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {coachHighlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-md bg-accent text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {coaches.map((coach) => (
              <Card key={coach.id || coach.name} className="coach-card">
                <CardContent>
                  <div className="coach-avatar">{coach.initials}</div>
                  <CardTitle className="mt-5">{coach.name}</CardTitle>
                  <Badge className="mt-3" variant="primary" appearance="light">
                    {coach.role}
                  </Badge>
                  <CardDescription className="mt-4 leading-6">
                    {coach.focus}
                  </CardDescription>
                  {isAdmin && (
                    <Button
                      className="coach-remove-button mt-5"
                      size="sm"
                      variant="outline"
                      onClick={() => removeCoach(coach.id)}
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {isAdmin && (
          <Card className="coach-admin-card mt-8">
            <CardHeader>
              <CardHeading>
                <CardTitle className="pt-2.5">
                  Add Weight Training Coach
                </CardTitle>
                <CardDescription>
                  Admin can add a new coach to the Silver Gym coach bench.
                </CardDescription>
              </CardHeading>
              <Badge variant="success" appearance="light">
                Admin
              </Badge>
            </CardHeader>
            <CardContent>
              <form className="coach-admin-form" onSubmit={handleAddCoach}>
                <div>
                  <label className="coach-label" htmlFor="coach-name">
                    Coach name
                  </label>
                  <Input
                    id="coach-name"
                    value={coachForm.name}
                    onChange={(event) =>
                      updateCoachForm("name", event.target.value)
                    }
                    placeholder="Coach name"
                    required
                  />
                </div>
                <div>
                  <label className="coach-label" htmlFor="coach-role">
                    Role
                  </label>
                  <Input
                    id="coach-role"
                    value={coachForm.role}
                    onChange={(event) =>
                      updateCoachForm("role", event.target.value)
                    }
                    placeholder="Weight Training Coach"
                    required
                  />
                </div>
                <div>
                  <label className="coach-label" htmlFor="coach-focus">
                    Focus
                  </label>
                  <Input
                    id="coach-focus"
                    value={coachForm.focus}
                    onChange={(event) =>
                      updateCoachForm("focus", event.target.value)
                    }
                    placeholder="Free weights, machines, form correction"
                    required
                  />
                </div>
                <Button type="submit" size="lg">
                  Add Coach
                  <Plus />
                </Button>
              </form>
              {coachAdded && (
                <div className="coach-added-message" role="status">
                  Coach added and saved to the database.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

export { CoachesSection };
