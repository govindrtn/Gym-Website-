import { ArrowRight, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BrandWordmark } from "@/components/site/BrandWordmark";
import { APP_ROUTES } from "@/routes";
import "./LoginPage.css";

function LoginPage({ loginError, onLogin }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onLogin({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
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
              <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
                Silver Gym login
              </h1>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Admin aur member sections ko separate rakho. Login ke baad
              dashboard, tabs aur actions role ke hisaab se change honge.
            </p>

          </div>

          <Card className="login-card">
            <CardHeader>
              <CardHeading>
                <CardTitle className="pt-2">Login to dashboard</CardTitle>
                <CardDescription>
                  Use your registered Silver Gym account.
                </CardDescription>
              </CardHeading>
              <div className="login-lock">
                <LockKeyhole className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="sr-only" htmlFor="login-email">
                    Email
                  </label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="login-password">
                    Password
                  </label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="Password"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
