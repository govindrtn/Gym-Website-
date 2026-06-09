import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { clubPillars, trainingFlow } from "@/data/siteData";
import { SectionIntro } from "./SectionIntro";
import "./ExperienceSection.css";

function ExperienceSection() {
  return (
    <section className="section-block club-section">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <SectionIntro
              align="left"
              badge="Club floor"
              title="A sharper training day, from check-in to cooldown."
              description="The space is built for coached reps, clean transitions, and a calm recovery finish."
            />

            <div className="mt-8 grid gap-3">
              {trainingFlow.map((item) => (
                <div key={item.label} className="flow-step">
                  <div className="w-16 shrink-0 text-sm font-semibold text-primary">{item.value}</div>
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:pt-10">
            {clubPillars.map((pillar) => (
              <Card key={pillar.title} className="club-card">
                <CardContent>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                      <pillar.icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {pillar.meta}
                    </Badge>
                  </div>
                  <CardTitle className="mt-6">{pillar.title}</CardTitle>
                  <CardDescription className="mt-3 leading-6">
                    {pillar.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { ExperienceSection };
