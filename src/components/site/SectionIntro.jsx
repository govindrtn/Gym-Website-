import { Badge } from "@/components/ui/badge";

function SectionIntro({ badge, title, description, align = "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <Badge variant="primary" appearance="light">
        {badge}
      </Badge>
      <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

export { SectionIntro };
