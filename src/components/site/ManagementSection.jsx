import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CalendarX,
  CheckCircle2,
  RotateCcw,
  Search,
  Trash2,
  UserPlus,
  UserCheck,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardHeading, CardTitle } from "@/components/ui/card";
import { CountingNumber } from "@/components/ui/counting-number";
import { Input } from "@/components/ui/input";
import { ProgressCircle } from "@/components/ui/progress";
import { ThemedSelect } from "@/components/ui/themed-select";
import { plans } from "@/data/siteData";
import { formatMembershipDate, getMembershipStatus } from "@/utils/membership";
import { SectionIntro } from "./SectionIntro";
import "./ManagementSection.css";

const initialMemberForm = {
  name: "",
  phone: "",
  address: "",
  plan: "1 Month",
  trainerRequired: "yes",
};

const trainerOptions = [
  { label: "Yes, trainer chahiye", value: "yes", detail: "Coach guidance required" },
  { label: "No trainer", value: "no", detail: "Self training" },
];

const planStatusOptions = [
  { label: "All plans", value: "all", detail: "Show every member" },
  { label: "Active", value: "active", detail: "Membership running" },
  { label: "Expiring soon", value: "expiring", detail: "Expires within 7 days" },
  { label: "Expired", value: "expired", detail: "Plan date is over" },
];

function ManagementSection({ members, addMember, removeMember, toggleAttendance, markDuePaid, resetDemoData }) {
  const [search, setSearch] = useState("");
  const [planStatusFilter, setPlanStatusFilter] = useState("all");
  const [memberForm, setMemberForm] = useState(initialMemberForm);
  const [memberAdded, setMemberAdded] = useState(false);

  const stats = useMemo(() => {
    const checkedIn = members.filter((member) => member.checkedIn).length;
    const pendingMembers = members.filter((member) => member.dueAmount > 0);
    const expiredMembers = members.filter((member) => getMembershipStatus(member).value === "expired");
    const totalDue = pendingMembers.reduce((sum, member) => sum + member.dueAmount, 0);
    const attendanceRate = members.length ? Math.round((checkedIn / members.length) * 100) : 0;

    return {
      checkedIn,
      pendingCount: pendingMembers.length,
      expiredCount: expiredMembers.length,
      totalDue,
      attendanceRate,
    };
  }, [members]);

  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const searchedMembers = query
      ? members.filter((member) => {
          const status = getMembershipStatus(member);

          return [
            member.name,
            member.plan,
            member.phone,
            member.id,
            member.address,
            member.membershipStartedAt,
            member.membershipExpiresAt,
            status.label,
            member.trainerRequired ? "trainer" : "no trainer",
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);
        })
      : members;

    if (planStatusFilter === "all") {
      return searchedMembers;
    }

    return searchedMembers.filter((member) => getMembershipStatus(member).value === planStatusFilter);
  }, [members, planStatusFilter, search]);

  const pendingMembers = visibleMembers.filter((member) => member.dueAmount > 0);
  const activeFilter = planStatusOptions.find((option) => option.value === planStatusFilter);

  function updateMemberForm(field, value) {
    setMemberAdded(false);
    setMemberForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleAddMember(event) {
    event.preventDefault();

    addMember({
      name: memberForm.name.trim(),
      phone: memberForm.phone.trim(),
      address: memberForm.address.trim(),
      plan: memberForm.plan,
      trainerRequired: memberForm.trainerRequired === "yes",
    });

    setSearch(memberForm.name.trim());
    setPlanStatusFilter("all");
    setMemberForm(initialMemberForm);
    setMemberAdded(true);
  }

  return (
    <section id="management" className="section-block management-section">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <SectionIntro
              align="left"
              badge="Gym operations"
              title="Attendance, dues, and plan expiry in one control panel."
              description="Track who is currently inside, spot pending payments, filter expired plans, and clear dues from the same Silver Gym dashboard."
            />

            <div className="management-search mt-8">
              <Search className="size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search member, plan, phone, expiry, or ID"
                aria-label="Search gym members"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="management-filter-row mt-4">
              <ThemedSelect
                id="member-status-filter"
                label="Plan status filter"
                value={planStatusFilter}
                options={planStatusOptions}
                onChange={setPlanStatusFilter}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="outline" onClick={resetDemoData}>
                <RotateCcw />
                Reset Demo
              </Button>
              <Badge variant="success" appearance="light" className="management-sync-badge">
                <CheckCircle2 className="size-3.5" />
                {activeFilter?.label}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <OpsStatCard
              icon={UserCheck}
              label="Checked in"
              value={stats.checkedIn}
              suffix={`/${members.length}`}
              tone="success"
            />
            <OpsStatCard
              icon={AlertTriangle}
              label="Pending dues"
              value={stats.pendingCount}
              suffix=" members"
              tone="warning"
            />
            <OpsStatCard
              icon={CalendarX}
              label="Expired plans"
              value={stats.expiredCount}
              suffix=" members"
              tone="warning"
            />
            <Card className="management-stat-card management-rate-card">
              <CardContent className="management-rate-content">
                <div className="management-rate-copy">
                  <div className="text-xs font-medium uppercase text-muted-foreground">Attendance rate</div>
                  <div className="mt-2 text-2xl font-semibold">{stats.attendanceRate}%</div>
                  <div className="management-rate-caption">
                    {stats.checkedIn}/{members.length || 0} checked in
                  </div>
                </div>
                <ProgressCircle
                  value={stats.attendanceRate}
                  size={68}
                  strokeWidth={6}
                  className="management-ring"
                  aria-label="Attendance rate"
                >
                  {stats.attendanceRate}%
                </ProgressCircle>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="management-workspace mt-10">
          <Card className="management-panel attendance-panel">
            <CardHeader>
              <CardHeading>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>Check members in/out and monitor plan expiry during front-desk entry.</CardDescription>
              </CardHeading>
              <Badge variant="primary" appearance="light">
                {visibleMembers.length} members
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="attendance-board">
                <div className="attendance-board-head" aria-hidden="true">
                  <span>Member</span>
                  <span>Membership</span>
                  <span>Visit status</span>
                  <span>Action</span>
                </div>

                {visibleMembers.length ? (
                  visibleMembers.map((member) => (
                    <MemberAttendanceRow
                      key={member.id}
                      member={member}
                      removeMember={removeMember}
                      toggleAttendance={toggleAttendance}
                    />
                  ))
                ) : (
                  <div className="attendance-empty">
                    <Search className="size-4" />
                    No members match the current search/filter.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="management-secondary-grid">
            <Card className="management-panel new-member-panel">
              <CardHeader>
                <CardHeading>
                  <CardTitle>Add New Member</CardTitle>
                  <CardDescription>Name, contact, address, duration plan, and trainer preference.</CardDescription>
                </CardHeading>
                <Badge variant="primary" appearance="light">
                  <UserPlus className="size-3.5" />
                  New
                </Badge>
              </CardHeader>
              <CardContent>
                <form className="new-member-form" onSubmit={handleAddMember}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="management-label" htmlFor="member-name">Name</label>
                      <Input
                        id="member-name"
                        value={memberForm.name}
                        onChange={(event) => updateMemberForm("name", event.target.value)}
                        placeholder="Member name"
                        required
                      />
                    </div>
                    <div>
                      <label className="management-label" htmlFor="member-phone">Contact number</label>
                      <Input
                        id="member-phone"
                        value={memberForm.phone}
                        onChange={(event) => updateMemberForm("phone", event.target.value)}
                        placeholder="8878257808"
                        inputMode="tel"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="management-label" htmlFor="member-address">Address</label>
                    <Input
                      id="member-address"
                      value={memberForm.address}
                      onChange={(event) => updateMemberForm("address", event.target.value)}
                      placeholder="Member address"
                      required
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <ThemedSelect
                        id="member-plan"
                        label="Plan"
                        value={memberForm.plan}
                        options={plans.map((plan) => ({
                          label: plan.name,
                          value: plan.name,
                          detail: `Rs ${plan.price} / ${plan.cadence}`,
                        }))}
                        onChange={(value) => updateMemberForm("plan", value)}
                      />
                    </div>
                    <div>
                      <ThemedSelect
                        id="member-trainer"
                        label="Trainer lena hai?"
                        value={memberForm.trainerRequired}
                        options={trainerOptions}
                        onChange={(value) => updateMemberForm("trainerRequired", value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg">
                    Add Member
                    <UserPlus />
                  </Button>

                  {memberAdded && (
                    <div className="member-added-message" role="status">
                      New member added. Plan fee pending dues me add ho gayi aur expiry selected duration ke hisaab se set ho gayi.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            <Card className="management-panel dues-panel">
              <CardHeader>
                <CardHeading>
                  <CardTitle>Fees Pending Due</CardTitle>
                  <CardDescription>
                    Total due: Rs{" "}
                    <CountingNumber to={stats.totalDue} duration={900} />
                  </CardDescription>
                </CardHeading>
                <Badge variant={stats.pendingCount ? "warning" : "success"}>
                  {stats.pendingCount ? "Action needed" : "Clear"}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-3">
                {pendingMembers.length ? (
                  pendingMembers.map((member) => (
                    <DueRow key={member.id} member={member} markDuePaid={markDuePaid} />
                  ))
                ) : (
                  <div className="dues-empty">
                    <CheckCircle2 className="size-5 text-primary" />
                    No pending dues for the current search/filter.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function OpsStatCard({ icon: Icon, label, value, suffix, tone }) {
  return (
    <Card className={`management-stat-card ${tone ? `management-stat-card-${tone}` : ""}`}>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
            <div className="mt-2 text-2xl font-semibold">
              <CountingNumber to={value} duration={900} />
              <span className="text-sm font-medium text-muted-foreground">{suffix}</span>
            </div>
          </div>
          <div className="management-stat-icon">
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MemberAttendanceRow({ member, removeMember, toggleAttendance }) {
  const membershipStatus = getMembershipStatus(member);

  return (
    <div className="attendance-row">
      <div className="member-cell">
        <div className="member-status-icon">
          {member.checkedIn ? <UserRoundCheck className="size-4" /> : <UserRoundX className="size-4" />}
        </div>
        <div className="min-w-0">
          <div className="member-name-line">{member.name}</div>
          <div className="member-meta">{member.id} | {member.phone}</div>
          <div className="member-address">{member.address}</div>
        </div>
      </div>

      <div className="attendance-stack">
        <span className="attendance-label">Membership</span>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" appearance="light" size="sm">
            {member.plan}
          </Badge>
          <Badge
            variant={membershipStatus.tone}
            appearance={membershipStatus.value === "active" ? "light" : "default"}
            size="sm"
          >
            {membershipStatus.label}
          </Badge>
          <Badge variant={member.trainerRequired ? "success" : "outline"} appearance={member.trainerRequired ? "light" : "default"} size="sm">
            Trainer: {member.trainerRequired ? "Yes" : "No"}
          </Badge>
        </div>
        <div className="member-expiry-line">
          Expires: {formatMembershipDate(member.membershipExpiresAt)}
        </div>
      </div>

      <div className="attendance-stack">
        <span className="attendance-label">Visit status</span>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={member.checkedIn ? "success" : "outline"} appearance={member.checkedIn ? "light" : "default"} size="sm">
            {member.checkedIn ? "Inside" : "Outside"}
          </Badge>
          <span className="table-muted">{member.lastVisit}</span>
        </div>
      </div>

      <div className="attendance-action">
        <Button
          size="sm"
          variant={member.checkedIn ? "outline" : "primary"}
          onClick={() => toggleAttendance(member.id)}
        >
          {member.checkedIn ? "Check out" : "Check in"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="member-remove-button"
          onClick={() => removeMember(member.id)}
          aria-label={`Remove ${member.name}`}
        >
          <Trash2 />
          Remove
        </Button>
      </div>
    </div>
  );
}

function DueRow({ member, markDuePaid }) {
  return (
    <div className="due-row">
      <div className="due-icon">
        <Banknote className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium">{member.name}</div>
          <Badge variant={member.dueDate === "Overdue" ? "warning" : "outline"} size="sm">
            {member.dueDate}
          </Badge>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {member.plan} plan | {member.phone} | Trainer: {member.trainerRequired ? "Yes" : "No"}
        </div>
      </div>
      <div className="due-action">
        <div className="text-right text-sm font-semibold">Rs {member.dueAmount}</div>
        <Button size="sm" variant="outline" onClick={() => markDuePaid(member.id)}>
          Mark paid
        </Button>
      </div>
    </div>
  );
}

export { ManagementSection };
