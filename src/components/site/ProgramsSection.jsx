import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { programs } from "@/data/siteData";
import { SectionIntro } from "./SectionIntro";
import "./ProgramsSection.css";

function ProgramsSection() {
  return (
    <section id="programs" className="section-block">
      <div className="container">
        <SectionIntro
          badge="Training menu"
          title="Coaching paths for every kind of strong."
          description="Pick the work that fits your goal, then progress with weekly structure and coach feedback."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {programs.map((program) => (
            <Card key={program.title} className="program-card">
              <CardHeader className="border-b-0 pb-0">
                <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <program.icon className="size-5" />
                </div>
                <Badge variant={program.tone} appearance="light" size="sm">
                  {program.tag}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle>{program.title}</CardTitle>
                <CardDescription className="mt-3 leading-6">
                  {program.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="min-h-0 border-t-0 pb-5 pt-0">
                <Button asChild variant="ghost" className="program-card-cta px-0 text-primary">
                  <a href="/contact" aria-label={`Explore ${program.title}`}>
                    Explore
                    <ArrowRight />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ProgramsSection };
