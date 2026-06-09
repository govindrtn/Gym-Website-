import { Navigate, Route, Routes } from "react-router-dom";
import {
  CaloriesPage,
  CoachesPage,
  ContactPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  ManagementPage,
  PlansPage,
  ResetPasswordPage,
  TimetablePage,
  TrainingPage,
} from "@/pages";
import { USER_ROLES } from "@/constants";
import { APP_ROUTES } from "./routeConfig";

function AppRoutingSetup({
  currentUser,
  loginError,
  members,
  coaches,
  filteredSchedule,
  selectedDay,
  setSelectedDay,
  selectedPlan,
  setSelectedPlan,
  submitted,
  whatsappMessage,
  handleLogin,
  handleSubmit,
  addMember,
  removeMember,
  addCoach,
  removeCoach,
  toggleAttendance,
  markDuePaid,
  resetDemoData,
}) {
  function requireAuth(element, allowedRoles) {
    if (!currentUser) {
      return <Navigate to={APP_ROUTES.LOGIN} replace />;
    }

    if (allowedRoles?.length && !allowedRoles.includes(currentUser.role)) {
      return <Navigate to={APP_ROUTES.HOME} replace />;
    }

    return element;
  }

  return (
    <Routes>
      <Route
        path={APP_ROUTES.LOGIN}
        element={
          currentUser
            ? <Navigate to={APP_ROUTES.HOME} replace />
            : <LoginPage loginError={loginError} onLogin={handleLogin} />
        }
      />
      <Route
        path={APP_ROUTES.FORGOT_PASSWORD}
        element={
          currentUser
            ? <Navigate to={APP_ROUTES.HOME} replace />
            : <ForgotPasswordPage />
        }
      />
      <Route
        path={APP_ROUTES.RESET_PASSWORD}
        element={
          currentUser
            ? <Navigate to={APP_ROUTES.HOME} replace />
            : <ResetPasswordPage />
        }
      />
      <Route
        path={APP_ROUTES.HOME}
        element={requireAuth(<HomePage currentUser={currentUser} members={members} />)}
      />
      <Route
        path={APP_ROUTES.TRAINING}
        element={requireAuth(<TrainingPage />)}
      />
      <Route
        path={APP_ROUTES.TIMETABLE}
        element={requireAuth(
          <TimetablePage
            filteredSchedule={filteredSchedule}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />,
        )}
      />
      <Route
        path={APP_ROUTES.CALORIES}
        element={requireAuth(<CaloriesPage />)}
      />
      <Route
        path={APP_ROUTES.MANAGEMENT}
        element={requireAuth(
          <ManagementPage
            members={members}
            addMember={addMember}
            removeMember={removeMember}
            toggleAttendance={toggleAttendance}
            markDuePaid={markDuePaid}
            resetDemoData={resetDemoData}
          />,
          [USER_ROLES.ADMIN],
        )}
      />
      <Route
        path={APP_ROUTES.COACHES}
        element={requireAuth(
          <CoachesPage
            currentUser={currentUser}
            coaches={coaches}
            addCoach={addCoach}
            removeCoach={removeCoach}
          />,
        )}
      />
      <Route
        path={APP_ROUTES.PLANS}
        element={requireAuth(
          <PlansPage
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />,
        )}
      />
      <Route
        path={APP_ROUTES.CONTACT}
        element={requireAuth(
          <ContactPage
            selectedPlan={selectedPlan}
            submitted={submitted}
            whatsappMessage={whatsappMessage}
            handleSubmit={handleSubmit}
          />,
        )}
      />
      <Route path="*" element={<Navigate to={currentUser ? APP_ROUTES.HOME : APP_ROUTES.LOGIN} replace />} />
    </Routes>
  );
}

export { AppRoutingSetup };
