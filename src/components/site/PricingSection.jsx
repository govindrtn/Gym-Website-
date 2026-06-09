import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { plans } from "@/data/siteData";
import { SectionIntro } from "./SectionIntro";
import "./PricingSection.css";

function PricingSection({ selectedPlan, setSelectedPlan }) {
  return (
    <section id="pricing" className="section-block bg-muted">
      <div className="container">
        <SectionIntro
          badge="Memberships"
          title="Duration plans for weight training."
          description="Choose 1 month, 3 month, 6 month, or 1 year membership based on your training consistency."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => {
            const selected = selectedPlan === plan.name;

            return (
              <Card
                key={plan.name}
                className={selected ? "plan-card selected-plan" : "plan-card"}
              >
                <CardHeader>
                  <CardHeading>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.note}</CardDescription>
                  </CardHeading>
                  {plan.featured && <Badge variant="success">Popular</Badge>}
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-semibold">Rs {plan.price}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/{plan.cadence}</span>
                  </div>
                  <div className="plan-fit mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
                      <span>Training fit</span>
                      <span>{plan.fitScore}%</span>
                    </div>
                    <Progress value={plan.fitScore} />
                  </div>
                  <ul className="mt-6 grid gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <span className="flex size-6 items-center justify-center rounded-full bg-accent text-primary">
                          <Check className="size-3.5" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={selected ? "primary" : "outline"}
                    aria-pressed={selected}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    {selected ? "Selected" : "Select Plan"}
                    <ArrowRight />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { PricingSection };
