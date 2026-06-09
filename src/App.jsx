import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { GymClickEffects } from "@/components/site/GymClickEffects";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AUTH_STORAGE_KEY } from "@/constants";
import {
  brand,
  coaches as initialCoaches,
  gymMembers,
  plans,
  schedule,
} from "@/data/siteData";
import { AppRoutingSetup, APP_ROUTES, VALID_APP_ROUTES } from "@/routes";
import { gymApi } from "@/services/gymApiService";
import { syncGoogleSheetAction } from "@/services/googleSheetService";
import {
  applyThemePreferences,
  getStoredThemePreferences,
  resolveThemeMode,
  saveThemePreferences,
} from "@/services/themePreferenceService";
import { createMembershipDates } from "@/utils/membership";
import {
  createTrialWhatsAppMessage,
  createWhatsAppUrl,
} from "@/utils/whatsapp";

const MEMBER_STORAGE_KEY = "silver-gym-members";
const COACH_STORAGE_KEY = "silver-gym-coaches";
const LEGACY_PLAN_MAP = {
  Starter: "1 Month",
  Performance: "3 Month",
  Elite: "6 Month",
};

function getPlanByName(planName) {
  return plans.find((plan) => plan.name === planName) ?? plans[0];
}

function normalizeMember(member, index = 0) {
  const normalizedPlanName = plans.some((plan) => plan.name === member.plan)
    ? member.plan
    : (LEGACY_PLAN_MAP[member.plan] ?? plans[0].name);
  const selectedPlan = getPlanByName(normalizedPlanName);
  const fallbackStartDate = new Date();

  if (member.dueDate === "Overdue") {
    fallbackStartDate.setDate(fallbackStartDate.getDate() - 1);
    fallbackStartDate.setMonth(
      fallbackStartDate.getMonth() - selectedPlan.months,
    );
  } else if (Number(member.dueAmount || 0) > 0) {
    fallbackStartDate.setDate(fallbackStartDate.getDate() + 3);
    fallbackStartDate.setMonth(
      fallbackStartDate.getMonth() - selectedPlan.months,
    );
  } else {
    fallbackStartDate.setDate(fallbackStartDate.getDate() - index * 8);
  }

  const fallbackDates = createMembershipDates(
    selectedPlan.months,
    fallbackStartDate,
  );

  return {
    ...member,
    plan: normalizedPlanName,
    membershipStartedAt:
      member.membershipStartedAt ?? fallbackDates.membershipStartedAt,
    membershipExpiresAt:
      member.membershipExpiresAt ?? fallbackDates.membershipExpiresAt,
  };
}

function createLocalMember(currentMembers, memberDetails) {
  const nextMemberNumber =
    currentMembers.reduce((maxNumber, member) => {
      const memberNumber = Number(member.id.replace("sg-", ""));
      return Number.isFinite(memberNumber)
        ? Math.max(maxNumber, memberNumber)
        : maxNumber;
    }, 100) + 1;
  const selectedPlanData = plans.find(
    (plan) => plan.name === memberDetails.plan,
  );
  const planDueAmount = Number(selectedPlanData?.price ?? 0);
  const membershipDates = createMembershipDates(selectedPlanData?.months ?? 1);

  return {
    id: `sg-${nextMemberNumber}`,
    name: memberDetails.name,
    plan: memberDetails.plan,
    phone: memberDetails.phone,
    address: memberDetails.address,
    trainerRequired: memberDetails.trainerRequired,
    ...membershipDates,
    lastVisit: "New member",
    checkedIn: false,
    dueAmount: planDueAmount,
    dueDate: "New",
  };
}

function normalizeCoach(coach, index = 0) {
  return {
    id: coach.id || `coach-${Date.now()}-${index}`,
    name: coach.name,
    role: coach.role,
    focus: coach.focus,
    initials: coach.initials || getInitials(coach.name),
  };
}

function getDemoMembers() {
  return gymMembers.map((member, index) => normalizeMember(member, index));
}

function getStoredMembers() {
  if (typeof window === "undefined") {
    return getDemoMembers();
  }

  try {
    const storedMembers = window.localStorage.getItem(MEMBER_STORAGE_KEY);
    const parsedMembers = storedMembers ? JSON.parse(storedMembers) : null;

    return Array.isArray(parsedMembers)
      ? parsedMembers.map((member, index) => normalizeMember(member, index))
      : getDemoMembers();
  } catch {
    return getDemoMembers();
  }
}

function getStoredCoaches() {
  if (typeof window === "undefined") {
    return initialCoaches;
  }

  try {
    const storedCoaches = window.localStorage.getItem(COACH_STORAGE_KEY);
    const parsedCoaches = storedCoaches ? JSON.parse(storedCoaches) : null;

    if (!Array.isArray(parsedCoaches)) {
      return initialCoaches;
    }

    return parsedCoaches.map((coach, index) => normalizeCoach(coach, index));
  } catch {
    return initialCoaches;
  }
}

function getStoredAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    return parsedUser?.role && parsedUser?.token ? parsedUser : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getStoredAuthUser);
  const [loginError, setLoginError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedPlan, setSelectedPlan] = useState("1 Month");
  const [submitted, setSubmitted] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [members, setMembers] = useState(getStoredMembers);
  const [coaches, setCoaches] = useState(getStoredCoaches);
  const [themePreferences, setThemePreferences] = useState(
    getStoredThemePreferences,
  );
  const [resolvedThemeMode, setResolvedThemeMode] = useState(() =>
    resolveThemeMode(getStoredThemePreferences().mode),
  );

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(currentUser),
      );
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [currentUser]);

  useEffect(() => {
    const nextResolvedMode = resolveThemeMode(themePreferences.mode);

    setResolvedThemeMode(nextResolvedMode);
    applyThemePreferences(themePreferences, nextResolvedMode);
    saveThemePreferences(themePreferences);

    if (themePreferences.mode !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      const updatedResolvedMode = resolveThemeMode("system");

      setResolvedThemeMode(updatedResolvedMode);
      applyThemePreferences(themePreferences, updatedResolvedMode);
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themePreferences]);

  useEffect(() => {
    let cancelled = false;

    async function validateStoredSession() {
      if (!currentUser?.token) {
        return;
      }

      try {
        const verifiedUser = await gymApi.getCurrentUser(currentUser.token);

        if (!cancelled) {
          setCurrentUser(verifiedUser);
        }
      } catch (error) {
        console.warn("Stored backend session is no longer valid.", error);

        if (!cancelled) {
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
          setCurrentUser(null);
          navigate(APP_ROUTES.LOGIN, { replace: true });
        }
      }
    }

    validateStoredSession();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.token, navigate]);

  useEffect(() => {
    window.localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    window.localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateBackendData() {
      if (!currentUser?.token) {
        return;
      }

      try {
        const [backendMembers, backendCoaches] = await Promise.all([
          gymApi.getMembers(currentUser.token),
          gymApi.getCoaches(currentUser.token),
        ]);

        if (cancelled) {
          return;
        }

        setMembers(
          backendMembers.map((member, index) => normalizeMember(member, index)),
        );
        setCoaches(
          backendCoaches.map((coach, index) => normalizeCoach(coach, index)),
        );
      } catch (error) {
        console.warn(
          "Backend data sync unavailable. Using local cached data.",
          error,
        );
      }
    }

    hydrateBackendData();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.token]);

  useEffect(() => {
    if (location.pathname !== APP_ROUTES.HOME) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (location.hash) {
      window.setTimeout(() => {
        document
          .querySelector(location.hash)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.hash, location.pathname]);

  useEffect(() => {
    function handleInternalLinkClick(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest("a");
      const href = link?.getAttribute("href");

      if (
        !href ||
        link.target === "_blank" ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:")
      ) {
        return;
      }

      const nextUrl = new URL(href, window.location.origin);

      if (
        nextUrl.origin !== window.location.origin ||
        (!href.startsWith("/") && !href.startsWith("#"))
      ) {
        return;
      }

      event.preventDefault();
      navigateTo(
        href.startsWith("#")
          ? `${APP_ROUTES.HOME}${href}`
          : `${nextUrl.pathname}${nextUrl.hash}`,
      );
    }

    document.addEventListener("click", handleInternalLinkClick);

    return () => document.removeEventListener("click", handleInternalLinkClick);
  }, []);

  const filteredSchedule = useMemo(() => {
    if (selectedDay === "All") {
      return schedule;
    }

    return schedule.filter((item) => item.day === selectedDay);
  }, [selectedDay]);

  function navigateTo(href) {
    const nextUrl = new URL(href, window.location.origin);
    const nextPathname = VALID_APP_ROUTES.includes(nextUrl.pathname)
      ? nextUrl.pathname
      : APP_ROUTES.HOME;

    navigate(`${nextPathname}${nextUrl.search}${nextUrl.hash}`);
    setMenuOpen(false);
  }

  async function handleLogin(credentials) {
    const email = String(credentials.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(credentials.password ?? "");

    try {
      const apiUser = await gymApi.login({ email, password });

      setCurrentUser(apiUser);
      setLoginError("");
      navigate(APP_ROUTES.HOME);
      return;
    } catch (error) {
      if (error?.status === 401) {
        setLoginError("Invalid email or password.");
        return;
      }

      console.warn("Backend login failed.", error);
      setLoginError(
        "Backend connect nahi ho raha. MongoDB aur API server check karo.",
      );
    }
  }

  function handleLogout() {
    const token = currentUser?.token;

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setLoginError("");
    setMenuOpen(false);
    navigate(APP_ROUTES.LOGIN);

    if (token) {
      void gymApi
        .logout(token)
        .catch((error) => console.warn("Backend logout failed", error));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const trialDetails = Object.fromEntries(formData.entries());
    const message = createTrialWhatsAppMessage(formData, selectedPlan);
    const primaryWhatsAppNumber = brand.whatsappNumbers[0]?.number;

    setWhatsappMessage(message);
    setSubmitted(true);

    if (currentUser?.token) {
      void gymApi
        .createEnquiry(
          {
            ...trialDetails,
            selectedPlan,
            message,
          },
          currentUser.token,
        )
        .catch((error) => console.warn("Backend enquiry save failed", error));
    }

    void syncGoogleSheetAction("contact_trial", {
      ...trialDetails,
      selectedPlan,
      message,
    });

    if (primaryWhatsAppNumber) {
      window.open(
        createWhatsAppUrl(primaryWhatsAppNumber, message),
        "_blank",
        "noopener,noreferrer",
      );
    }
  }

  function toggleAttendance(memberId) {
    const selectedMember = members.find((member) => member.id === memberId);

    if (selectedMember) {
      void syncGoogleSheetAction("attendance_updated", {
        id: selectedMember.id,
        name: selectedMember.name,
        plan: selectedMember.plan,
        checkedIn: !selectedMember.checkedIn,
        lastVisit: selectedMember.checkedIn
          ? selectedMember.lastVisit
          : "Just now",
      });
    }

    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              checkedIn: !member.checkedIn,
              lastVisit: member.checkedIn ? member.lastVisit : "Just now",
            }
          : member,
      ),
    );

    if (currentUser?.token) {
      void gymApi
        .toggleAttendance(memberId, currentUser.token)
        .then((updatedMember) => {
          setMembers((currentMembers) =>
            currentMembers.map((member) =>
              member.id === updatedMember.id
                ? normalizeMember(updatedMember)
                : member,
            ),
          );
        })
        .catch((error) =>
          console.warn("Backend attendance update failed", error),
        );
    }
  }

  function markDuePaid(memberId) {
    const selectedMember = members.find((member) => member.id === memberId);

    if (selectedMember) {
      void syncGoogleSheetAction("due_paid", {
        id: selectedMember.id,
        name: selectedMember.name,
        plan: selectedMember.plan,
        previousDueAmount: selectedMember.dueAmount,
        paidAt: new Date().toISOString(),
      });
    }

    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              dueAmount: 0,
              dueDate: "Paid",
            }
          : member,
      ),
    );

    if (currentUser?.token) {
      void gymApi
        .markDuePaid(memberId, currentUser.token)
        .then((updatedMember) => {
          setMembers((currentMembers) =>
            currentMembers.map((member) =>
              member.id === updatedMember.id
                ? normalizeMember(updatedMember)
                : member,
            ),
          );
        })
        .catch((error) => console.warn("Backend due update failed", error));
    }
  }

  async function addMember(memberDetails) {
    if (currentUser?.token) {
      try {
        const savedMember = await gymApi.createMember(
          memberDetails,
          currentUser.token,
        );
        const normalizedMember = normalizeMember(savedMember);

        setMembers((currentMembers) => [
          normalizedMember,
          ...currentMembers.filter(
            (member) => member.id !== normalizedMember.id,
          ),
        ]);
        void syncGoogleSheetAction("member_added", normalizedMember);
        return;
      } catch (error) {
        console.warn("Backend member create failed. Saving locally.", error);
      }
    }

    const nextMember = createLocalMember(members, memberDetails);

    setMembers((currentMembers) => [nextMember, ...currentMembers]);
    void syncGoogleSheetAction("member_added", nextMember);
  }

  function removeMember(memberId) {
    const selectedMember = members.find((member) => member.id === memberId);

    setMembers((currentMembers) =>
      currentMembers.filter((member) => member.id !== memberId),
    );

    if (selectedMember) {
      void syncGoogleSheetAction("member_removed", selectedMember);
    }

    if (currentUser?.token) {
      void gymApi
        .deleteMember(memberId, currentUser.token)
        .catch((error) => console.warn("Backend member remove failed", error));
    }
  }

  async function addCoach(coachDetails) {
    if (currentUser?.token) {
      try {
        const savedCoach = await gymApi.createCoach(
          coachDetails,
          currentUser.token,
        );
        const normalizedCoach = normalizeCoach(savedCoach);

        setCoaches((currentCoaches) => [
          normalizedCoach,
          ...currentCoaches.filter((coach) => coach.id !== normalizedCoach.id),
        ]);
        void syncGoogleSheetAction("coach_added", normalizedCoach);
        return;
      } catch (error) {
        console.warn("Backend coach create failed. Saving locally.", error);
      }
    }

    const nextCoach = {
      id: `coach-${Date.now()}`,
      name: coachDetails.name,
      role: coachDetails.role,
      focus: coachDetails.focus,
      initials: getInitials(coachDetails.name),
    };

    setCoaches((currentCoaches) => [nextCoach, ...currentCoaches]);
    void syncGoogleSheetAction("coach_added", nextCoach);
  }

  function removeCoach(coachId) {
    const selectedCoach = coaches.find((coach) => coach.id === coachId);

    setCoaches((currentCoaches) =>
      currentCoaches.filter((coach) => coach.id !== coachId),
    );

    if (selectedCoach) {
      void syncGoogleSheetAction("coach_removed", selectedCoach);
    }

    if (currentUser?.token) {
      void gymApi
        .deleteCoach(coachId, currentUser.token)
        .catch((error) => console.warn("Backend coach remove failed", error));
    }
  }

  async function resetDemoData() {
    if (currentUser?.token) {
      try {
        const backendDemoMembers = await gymApi.resetDemoMembers(
          currentUser.token,
        );
        const normalizedMembers = backendDemoMembers.map((member, index) =>
          normalizeMember(member, index),
        );

        setMembers(normalizedMembers);
        void syncGoogleSheetAction("demo_reset", {
          membersCount: normalizedMembers.length,
          resetAt: new Date().toISOString(),
        });
        return;
      } catch (error) {
        console.warn("Backend demo reset failed. Resetting locally.", error);
      }
    }

    const demoMembers = getDemoMembers();

    setMembers(demoMembers);
    void syncGoogleSheetAction("demo_reset", {
      membersCount: demoMembers.length,
      resetAt: new Date().toISOString(),
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GymClickEffects />
      <SiteHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentPath={location.pathname}
        currentHash={location.hash}
        themePreferences={themePreferences}
        resolvedThemeMode={resolvedThemeMode}
        onThemeChange={setThemePreferences}
      />
      <main className="route-page">
        <AppRoutingSetup
          currentUser={currentUser}
          loginError={loginError}
          members={members}
          coaches={coaches}
          filteredSchedule={filteredSchedule}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          submitted={submitted}
          whatsappMessage={whatsappMessage}
          handleLogin={handleLogin}
          handleSubmit={handleSubmit}
          addMember={addMember}
          removeMember={removeMember}
          addCoach={addCoach}
          removeCoach={removeCoach}
          toggleAttendance={toggleAttendance}
          markDuePaid={markDuePaid}
          resetDemoData={resetDemoData}
        />
      </main>
      <SiteFooter onNavigate={navigateTo} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
