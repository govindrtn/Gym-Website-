import { ArrowRight, CalendarDays, ShieldCheck, Star, Timer } from "lucide-react";
import { ShimmeringText, TypingText, WordRotate } from "@/components/ui/animated-text";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/ui/progress";
import { TechGridBackground } from "@/components/ui/tech-background";
import { brand, todaySessions } from "@/data/siteData";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section id="top" className="hero-section">
      <div className="hero-media" />
      <div className="hero-overlay" />
      <TechGridBackground className="hero-tech-grid" beams={7} />
      <div className="container relative z-10 grid min-h-[88svh] items-center pt-20 text-white lg:min-h-[90svh]">
        <div className="grid w-full gap-10 pb-10 pt-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.45fr)] lg:items-end">
          <div className="hero-copy max-w-2xl">
            <Badge appearance="light" variant="success" className="hero-badge mb-5 bg-white/12 text-emerald-100">
              <BadgeDot />
              Premium strength club
            </Badge>
            <h1 className="hero-title max-w-xl text-5xl font-semibold leading-[1.02] sm:text-6xl">
              <ShimmeringText
                text={brand.name}
                color="rgb(226 232 240)"
                shimmerColor="rgb(134 239 172)"
              />
            </h1>
            <p className="hero-subtitle mt-5 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg">
              Coaching-led{" "}
              <WordRotate
                words={["strength", "conditioning", "recovery"]}
                className="hero-rotating-word"
              />{" "}
              for people who want a sharper body and a calmer routine.
            </p>
            <div className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#pricing">
                  View Memberships
                  <ArrowRight />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                <a href="#schedule">
                  <CalendarDays />
                  Class Timetable
                </a>
              </Button>
            </div>
            <div className="hero-stat-grid mt-10 grid max-w-xl grid-cols-3 gap-3">
              <HeroStat icon={Timer} label="45 min" sublabel="sessions" />
              <HeroStat icon={ShieldCheck} label="24/7" sublabel="access" />
              <HeroStat icon={Star} label="4.9/5" sublabel="rated" />
            </div>
          </div>

          <HeroSessionPanel />
        </div>
      </div>
    </section>
  );
}

function HeroSessionPanel() {
  return (
    <aside className="hero-panel hidden lg:block" aria-label={`Today at ${brand.name}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase text-emerald-200">
            <TypingText text={`Today at ${brand.name}`} speed={34} />
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-tight">3 coached blocks before work ends.</h2>
        </div>
        <ProgressCircle
          className="hero-readiness-ring"
          value={82}
          size={58}
          strokeWidth={5}
          aria-label="Club readiness"
        >
          82
        </ProgressCircle>
      </div>

      <div className="mt-5 divide-y divide-white/10">
        {todaySessions.map((session) => (
          <div key={`${session.time}-${session.name}`} className="hero-session-row grid grid-cols-[4rem_1fr] gap-3 py-3">
            <div className="font-semibold text-emerald-200">{session.time}</div>
            <div>
              <div className="text-sm font-medium">{session.name}</div>
              <div className="mt-0.5 text-xs text-zinc-400">{session.coach}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {["Strength", "Sweat", "Recover"].map((label) => (
          <div key={label} className="hero-chip">
            {label}
          </div>
        ))}
      </div>
    </aside>
  );
}

function HeroStat({ icon: Icon, label, sublabel }) {
  return (
    <div className="hero-stat">
      <Icon className="mb-3 size-4 text-emerald-300" />
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-xs text-zinc-300">{sublabel}</div>
    </div>
  );
}

export { HeroSection };
