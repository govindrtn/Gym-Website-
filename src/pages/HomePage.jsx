import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  ClipboardCheck,
  Download,
  Dumbbell,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardHeading, CardTitle } from "@/components/ui/card";
import { ShimmeringText, TypingText, WordRotate } from "@/components/ui/animated-text";
import { CountingNumber } from "@/components/ui/counting-number";
import { Progress, ProgressCircle } from "@/components/ui/progress";
import { TechGridBackground } from "@/components/ui/tech-background";
import { USER_ROLES } from "@/constants";
import { plans } from "@/data/siteData";
import { downloadGymReport } from "@/utils/downloadGymReport";
import "./HomePage.css";

function HomePage({ currentUser, members }) {
  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;
  const activeMembers = members.filter((member) => member.checkedIn).length;
  const attendancePercent = members.length ? Math.round((activeMembers / members.length) * 100) : 0;
  const pendingDue = members.reduce((sum, member) => sum + Number(member.dueAmount || 0), 0);
  const monthlyPotential = members.reduce((sum, member) => {
    const memberPlan = plans.find((plan) => plan.name === member.plan);
    return sum + Number(memberPlan?.price ?? 0);
  }, 0);
  const monthlyCollected = Math.max(monthlyPotential - pendingDue, 0);
  const monthlyPerformance = monthlyPotential
    ? Math.round((monthlyCollected / monthlyPotential) * 100)
    : 0;
  const pendingDueMembers = members.filter((member) => Number(member.dueAmount || 0) > 0);
  const paidMembers = members.length - pendingDueMembers.length;
  const trainerMembers = members.filter((member) => member.trainerRequired).length;
  const trainerDemandPercent = members.length ? Math.round((trainerMembers / members.length) * 100) : 0;
  const accountClearPercent = members.length ? Math.round((paidMembers / members.length) * 100) : 0;
  const activeMemberPreview = members.filter((member) => member.checkedIn).slice(0, 3);
  const dueFollowUps = pendingDueMembers.slice(0, 3);
  const planMix = plans.map((plan) => {
    const count = members.filter((member) => member.plan === plan.name).length;

    return {
      name: plan.name,
      count,
      percent: members.length ? Math.round((count / members.length) * 100) : 0,
    };
  });
  const commandTiles = isAdmin
    ? [
        {
          title: "Add new member",
          detail: "Name, address, contact, plan and trainer preference.",
          href: "/management",
          icon: UserPlus,
          meta: "Member desk",
        },
        {
          title: "Review fee dues",
          detail: `${pendingDueMembers.length} member${pendingDueMembers.length === 1 ? "" : "s"} need follow-up.`,
          href: "/management",
          icon: IndianRupee,
          meta: `Rs ${pendingDue}`,
        },
        {
          title: "Book trial lead",
          detail: "Send enquiry details to Silver Gym WhatsApp.",
          href: "/contact",
          icon: ArrowRight,
          meta: "WhatsApp ready",
        },
      ]
    : [
        {
          title: "Explore training",
          detail: "Strength, conditioning, recovery and small group coaching.",
          href: "/training",
          icon: Dumbbell,
          meta: "Workout",
        },
        {
          title: "Check timetable",
          detail: "Plan your session around morning and evening slots.",
          href: "/timetable",
          icon: CalendarCheck,
          meta: "Schedule",
        },
        {
          title: "Send enquiry",
          detail: "Book a trial or ask Silver Gym on WhatsApp.",
          href: "/contact",
          icon: ArrowRight,
          meta: "Join",
        },
      ];
  const dailyFlow = [
    {
      time: "05:30",
      title: "Floor opens",
      detail: "Equipment check, warm-up zone and entry desk ready.",
      icon: Dumbbell,
    },
    {
      time: "Now",
      title: "Live attendance",
      detail: isAdmin
        ? `${activeMembers} active member${activeMembers === 1 ? "" : "s"} checked in today.`
        : "Coach-led training blocks stay ready for every member.",
      icon: Activity,
    },
    {
      time: "Evening",
      title: "Trainer slots",
      detail: `${trainerMembers} member${trainerMembers === 1 ? "" : "s"} prefer trainer-led work.`,
      icon: ShieldCheck,
    },
    {
      time: "Close",
      title: "Export report",
      detail: "Download Excel for attendance, dues and membership records.",
      icon: ClipboardCheck,
    },
  ];
  const motivationCards = [
    {
      title: "Show up first",
      detail: "Aaj ka perfect workout nahi, regular check-in hi real progress banata hai.",
      icon: Dumbbell,
    },
    {
      title: "Control every rep",
      detail: "Slow form, strong breathing, clean movement. Strength wahi se start hoti hai.",
      icon: ShieldCheck,
    },
    {
      title: "Finish stronger",
      detail: "Last set body nahi, mindset train karta hai. Bas ek rep aur.",
      icon: TrendingUp,
    },
  ];
  const repRhythm = [
    { label: "Warm-up", value: "10 min" },
    { label: "Main lift", value: "5 sets" },
    { label: "Finisher", value: "8 min" },
  ];

  return (
    <section className="section-block home-dashboard">
      <TechGridBackground className="home-tech-layer" beams={9} />
      <div className="container relative z-10">
        <div className="home-dashboard-hero-grid grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="home-hero-copy">
            <Badge variant="success" appearance="light">
              {isAdmin ? "Admin dashboard" : "Member dashboard"}
            </Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              <ShimmeringText
                text={isAdmin ? "Silver Gym daily control room." : "Silver Gym member training zone."}
                color="var(--foreground)"
                shimmerColor="var(--primary)"
              />
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Track today's{" "}
              <WordRotate
                className="home-rotating-word"
                words={
                  isAdmin
                    ? ["active members", "attendance percentage", "fee recovery", "monthly performance"]
                    : ["training plan", "class timetable", "coach support", "daily motivation"]
                }
              />{" "}
              from one live home screen.
            </p>
            <div className="home-live-line">
              <span className="home-live-dot" aria-hidden="true" />
              <TypingText
                texts={["Local storage sync online", "Attendance engine active", "Excel report ready"]}
                speed={36}
                pauseDuration={1400}
                loop
              />
            </div>
            <div className="home-action-bar mt-7 flex flex-col gap-3 sm:flex-row">
              {isAdmin ? (
                <>
                  <Button asChild size="lg">
                    <a href="/management">
                      Open Members
                      <Users />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => downloadGymReport(members)}>
                    Download Excel Report
                    <Download />
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg">
                    <a href="/training">
                      Start Training
                      <Dumbbell />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="/plans">
                      View Plans
                      <ArrowRight />
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>

          <Card className="home-dashboard-panel">
            <CardHeader className="home-dashboard-panel-header">
              <CardHeading className="home-dashboard-panel-heading">
                <CardTitle>{isAdmin ? "Today's Attendance" : "Member Training Pulse"}</CardTitle>
                <CardDescription>
                  {isAdmin ? "Live member entry status from local storage." : "Your public member sections are ready."}
                </CardDescription>
              </CardHeading>
              <ProgressCircle className="home-attendance-ring" value={isAdmin ? attendancePercent : 86} size={76} strokeWidth={7}>
                {isAdmin ? attendancePercent : 86}%
              </ProgressCircle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {isAdmin ? (
                  <>
                    <MiniMetric label="Total members" value={members.length} icon={Users} />
                    <MiniMetric label="Active today" value={activeMembers} icon={UserCheck} />
                    <MiniMetric label="Pending dues" value={pendingDue} prefix="Rs " icon={AlertTriangle} />
                  </>
                ) : (
                  <>
                    <MiniMetric label="Training plans" value={plans.length} icon={Dumbbell} />
                    <MiniMetric label="Focus score" value={86} icon={UserCheck} />
                    <MiniMetric label="Rep blocks" value={repRhythm.length} icon={Activity} />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <>
            <div className="home-primary-metrics mt-10 grid gap-5 lg:grid-cols-3">
              <Card className="home-metric-card home-rate-card">
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium uppercase text-muted-foreground">Active members today</div>
                      <div className="mt-2 text-3xl font-semibold">
                        <CountingNumber to={activeMembers} duration={900} />
                        <span className="text-sm font-medium text-muted-foreground">/{members.length}</span>
                      </div>
                    </div>
                    <div className="home-metric-icon">
                      <UserCheck className="size-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="home-metric-card">
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium uppercase text-muted-foreground">Today's attendance</div>
                      <div className="mt-2 text-3xl font-semibold">{attendancePercent}%</div>
                    </div>
                    <div className="home-metric-icon">
                      <CalendarCheck className="size-5" />
                    </div>
                  </div>
                  <div className="home-rate-progress-block">
                    <div className="home-rate-progress-meta">
                      <span>Checked-in ratio</span>
                      <strong>
                        {activeMembers}/{members.length || 0}
                      </strong>
                    </div>
                    <Progress
                      className="home-rate-progress"
                      indicatorClassName="home-rate-progress-indicator"
                      value={attendancePercent}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="home-metric-card home-rate-card">
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium uppercase text-muted-foreground">Monthly performance</div>
                      <div className="mt-2 text-3xl font-semibold">{monthlyPerformance}%</div>
                    </div>
                    <div className="home-metric-icon">
                      <TrendingUp className="size-5" />
                    </div>
                  </div>
                  <div className="home-rate-progress-block">
                    <div className="home-rate-progress-meta">
                      <span>Collection ratio</span>
                      <strong>Rs {monthlyCollected}</strong>
                    </div>
                    <Progress
                      className="home-rate-progress"
                      indicatorClassName="home-rate-progress-indicator"
                      value={monthlyPerformance}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="home-report-card mt-5">
              <CardHeader>
                <CardHeading>
                  <CardTitle>Excel Report</CardTitle>
                  <CardDescription>Download member attendance, trainer preference, and due amount data.</CardDescription>
                </CardHeading>
                <Button variant="outline" onClick={() => downloadGymReport(members)}>
                  Download Excel
                  <Download />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="home-report-row">
                  <div>
                    <div className="text-sm font-medium">Monthly collection</div>
                    <div className="text-xs text-muted-foreground">Collected vs expected plan value</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">Rs {monthlyCollected}</div>
                    <div className="text-xs text-muted-foreground">of Rs {monthlyPotential}</div>
                  </div>
                </div>
                <div className="home-report-row">
                  <div>
                    <div className="text-sm font-medium">Fee pending due</div>
                    <div className="text-xs text-muted-foreground">Pending amount across all members</div>
                  </div>
                  <div className="text-sm font-semibold">Rs {pendingDue}</div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="home-insights-grid mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="home-insight-card home-command-card">
            <CardHeader>
              <CardHeading>
                <CardTitle>Command Shortcuts</CardTitle>
                <CardDescription>Fast actions for daily front-desk work.</CardDescription>
              </CardHeading>
              <Badge variant="info" appearance="light">
                Live
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="home-action-grid">
                {commandTiles.map((tile) => (
                  <HomeActionTile key={tile.title} {...tile} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="home-insight-card home-flow-card">
            <CardHeader>
              <CardHeading>
                <CardTitle>Today's Gym Flow</CardTitle>
                <CardDescription>Operational rhythm for the day.</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent>
              <div className="home-flow-list">
                {dailyFlow.map((item) => (
                  <HomeFlowItem key={`${item.time}-${item.title}`} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <div className="home-admin-insights-grid mt-5 grid gap-5 lg:grid-cols-2">
            <Card className="home-insight-card home-member-card">
              <CardHeader>
                <CardHeading>
                  <CardTitle>Live Member Signal</CardTitle>
                  <CardDescription>Current check-ins and payment follow-ups.</CardDescription>
                </CardHeading>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div>
                  <div className="home-panel-label">Active now</div>
                  <div className="mt-3 grid gap-3">
                    {activeMemberPreview.length ? (
                      activeMemberPreview.map((member) => (
                        <HomeMemberRow key={member.id} member={member} tone="active" />
                      ))
                    ) : (
                      <div className="home-empty-state">No live check-ins yet.</div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="home-panel-label">Due follow-up</div>
                  <div className="mt-3 grid gap-3">
                    {dueFollowUps.length ? (
                      dueFollowUps.map((member) => (
                        <HomeMemberRow key={member.id} member={member} tone="due" />
                      ))
                    ) : (
                      <div className="home-empty-state">All member fees are clear.</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="home-insight-card home-plan-card">
              <CardHeader>
                <CardHeading>
                  <CardTitle>Performance Radar</CardTitle>
                  <CardDescription>Attendance, collection and plan distribution.</CardDescription>
                </CardHeading>
              </CardHeader>
              <CardContent>
                <div className="home-signal-stack">
                  <HomeSignalRow label="Attendance health" value={attendancePercent} meta={`${activeMembers}/${members.length} inside`} />
                  <HomeSignalRow label="Monthly collection" value={monthlyPerformance} meta={`Rs ${monthlyCollected} collected`} />
                  <HomeSignalRow label="Trainer demand" value={trainerDemandPercent} meta={`${trainerMembers} trainer members`} />
                  <HomeSignalRow label="Accounts clear" value={accountClearPercent} meta={`${paidMembers} paid members`} />
                </div>

                <div className="home-plan-mix">
                  <div className="home-panel-label">Membership split</div>
                  <div className="mt-3 grid gap-3">
                    {planMix.map((plan) => (
                      <HomePlanRow key={plan.name} plan={plan} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="home-insight-card home-motivation-card mt-5">
          <CardContent className="home-motivation-content">
            <div className="home-motivation-copy">
              <Badge variant="success" appearance="light">
                Motivation zone
              </Badge>
              <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl">
                Discipline builds the body before the mirror does.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Har attendance mark ek small win hai. Train with control, recover with patience,
                and let consistency do the heavy lifting.
              </p>
              <div className="home-motivation-grid">
                {motivationCards.map((card) => (
                  <HomeMotivationCard key={card.title} {...card} />
                ))}
              </div>
            </div>

            <div className="home-gym-motion-panel">
              <div className="home-barbell-stage" aria-hidden="true">
                <span className="home-energy-line home-energy-line-one" />
                <span className="home-energy-line home-energy-line-two" />
                <span className="home-barbell">
                  <span className="home-plate home-plate-left-outer" />
                  <span className="home-plate home-plate-left-inner" />
                  <span className="home-barbell-grip" />
                  <span className="home-plate home-plate-right-inner" />
                  <span className="home-plate home-plate-right-outer" />
                </span>
                <span className="home-lifter">
                  <span className="home-lifter-head" />
                  <span className="home-lifter-body" />
                  <span className="home-lifter-leg home-lifter-leg-left" />
                  <span className="home-lifter-leg home-lifter-leg-right" />
                </span>
                <span className="home-lift-floor" />
              </div>

              <div className="home-rep-board">
                <div>
                  <div className="home-panel-label">Rep rhythm</div>
                  <div className="mt-1 text-sm font-semibold">Train smart, lift clean</div>
                </div>
                <div className="home-rep-grid">
                  {repRhythm.map((item) => (
                    <div className="home-rep-chip" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MiniMetric({ icon: Icon, label, value, prefix = "" }) {
  return (
    <div className="home-mini-metric rounded-lg border border-border bg-card p-4">
      <Icon className="mb-3 size-4 text-primary" />
      <div className="text-xl font-semibold">
        {prefix}
        <CountingNumber to={value} duration={900} />
      </div>
      <div className="mt-1 text-xs font-medium uppercase text-muted-foreground">{label}</div>
    </div>
  );
}

function HomeActionTile({ icon: Icon, title, detail, href, meta }) {
  return (
    <a className="home-action-tile" href={href}>
      <span className="home-action-icon">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="home-action-title">{title}</span>
        <span className="home-action-detail">{detail}</span>
      </span>
      <span className="home-action-meta">{meta}</span>
    </a>
  );
}

function HomeFlowItem({ icon: Icon, time, title, detail }) {
  return (
    <div className="home-flow-item">
      <div className="home-flow-time">{time}</div>
      <div className="home-flow-node">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}

function HomeSignalRow({ label, value, meta }) {
  return (
    <div className="home-signal-row">
      <div className="home-signal-top">
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{meta}</div>
        </div>
        <div className="home-signal-value">
          <CountingNumber to={value} duration={850} />%
        </div>
      </div>
      <Progress className="mt-3" value={value} />
    </div>
  );
}

function HomeMemberRow({ member, tone }) {
  const isDue = tone === "due";

  return (
    <div className="home-member-row">
      <span className="home-member-avatar">{getInitials(member.name)}</span>
      <span className="min-w-0">
        <span className="home-member-name">{member.name}</span>
        <span className="home-member-meta">{isDue ? member.dueDate : member.lastVisit}</span>
      </span>
      <Badge variant={isDue ? "warning" : "success"} appearance="light">
        {isDue ? `Rs ${member.dueAmount}` : "Inside"}
      </Badge>
    </div>
  );
}

function HomePlanRow({ plan }) {
  return (
    <div className="home-plan-row">
      <div className="home-plan-top">
        <div className="text-sm font-medium">{plan.name}</div>
        <div className="text-xs font-semibold text-muted-foreground">
          <CountingNumber to={plan.count} duration={750} /> members
        </div>
      </div>
      <Progress className="mt-2" value={plan.percent} />
    </div>
  );
}

function HomeMotivationCard({ icon: Icon, title, detail }) {
  return (
    <div className="home-motivation-tile">
      <span className="home-motivation-icon">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="home-motivation-title">{title}</span>
        <span className="home-motivation-detail">{detail}</span>
      </span>
    </div>
  );
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default HomePage;
