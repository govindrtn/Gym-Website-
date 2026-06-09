import { useState } from "react";
import { ArrowRight, Dumbbell, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardHeading, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BrandWordmark } from "@/components/site/BrandWordmark";
import { DEMO_ACCOUNTS, USER_ROLES } from "@/constants";
import { APP_ROUTES } from "@/routes";
import "./LoginPage.css";

const roleContent = {
  [USER_ROLES.ADMIN]: {
    title: "Admin Control",
    detail: "Members, attendance, fees, reports and front-desk actions.",
    icon: ShieldCheck,
  },
  [USER_ROLES.USER]: {
    title: "Member Access",
    detail: "Training, timetable, coaches, plans, enquiry and motivation content.",
    icon: UserRound,
  },
};

function LoginPage({ loginError, onLogin }) {
  const [selectedAccount, setSelectedAccount] = useState(DEMO_ACCOUNTS[0]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onLogin({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  }

  function handleDemoLogin(account) {
    setSelectedAccount(account);
    onLogin({
      email: account.email,
      password: account.password,
    });
  }

  return (
    <section className="login-page section-block">
      <div className="container relative z-10">
        <div className="login-shell">
          <div className="login-copy">
            <Badge variant="success" appearance="light">
              Secure access
            </Badge>
            <div className="mt-5 grid gap-3">
              <BrandWordmark tone="dark" className="login-brand-wordmark" />
              <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">Silver Gym login</h1>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Admin aur member sections ko separate rakho. Login ke baad dashboard, tabs aur actions role ke hisaab se change honge.
            </p>

            <div className="login-role-grid">
              {DEMO_ACCOUNTS.map((account) => {
                const RoleIcon = roleContent[account.role].icon;

                return (
                  <button
                    key={account.role}
                    type="button"
                    className={selectedAccount.role === account.role ? "login-role-card is-active" : "login-role-card"}
                    onClick={() => setSelectedAccount(account)}
                  >
                    <span className="login-role-icon">
                      <RoleIcon className="size-4" />
                    </span>
                    <span>
                      <span className="login-role-title">{roleContent[account.role].title}</span>
                      <span className="login-role-detail">{roleContent[account.role].detail}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="login-card">
            <CardHeader>
              <CardHeading>
                <CardTitle>Login to dashboard</CardTitle>
                <CardDescription>
                  Demo: {selectedAccount.email} / {selectedAccount.password}
                </CardDescription>
              </CardHeading>
              <div className="login-lock">
                <LockKeyhole className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <form key={selectedAccount.role} className="grid gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="sr-only" htmlFor="login-email">Email</label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    defaultValue={selectedAccount.email}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="login-password">Password</label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    defaultValue={selectedAccount.password}
                    autoComplete="current-password"
                    required
                  />
                </div>
                {loginError && <div className="login-error">{loginError}</div>}
                <div className="login-password-help">
                  <a href={APP_ROUTES.FORGOT_PASSWORD}>Forgot password?</a>
                </div>
                <Button type="submit" size="lg">
                  Login
                  <ArrowRight />
                </Button>
              </form>

              <div className="login-demo-actions">
                {DEMO_ACCOUNTS.map((account) => (
                  <Button
                    key={account.role}
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin(account)}
                  >
                    {account.role === USER_ROLES.ADMIN ? "Login as Admin" : "Login as User"}
                    <Dumbbell />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
