import { useState } from "react";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react";
import { BrandWordmark } from "@/components/site/BrandWordmark";
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
import { APP_ROUTES } from "@/routes";
import { gymApi } from "@/services/gymApiService";
import "./PasswordRecovery.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setSubmitting(true);

    try {
      const response = await gymApi.forgotPassword(email.trim());
      setResult(response);
    } catch (requestError) {
      setError(requestError.message || "Reset link generate nahi ho paaya.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="password-recovery-page section-block">
      <div className="container relative z-10">
        <Card className="password-recovery-card py-2.5">
          <CardHeader>
            <CardHeading>
              <div className="password-recovery-brand">
                <BrandWordmark tone="dark" />
              </div>
              <CardTitle className="mt-4">Forgot password</CardTitle>
              <CardDescription>
                Apna registered email enter karo. Development mode me reset link
                yahin milega.
              </CardDescription>
            </CardHeading>
            <div className="password-recovery-icon">
              <KeyRound className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="password-recovery-label"
                  htmlFor="forgot-email"
                >
                  Email address
                </label>
                <div className="password-recovery-input">
                  <Mail className="size-4" />
                  <Input
                    id="forgot-email"
                    className="password-recovery-email-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {error && <div className="password-recovery-error">{error}</div>}

              {result && (
                <div className="password-recovery-success" role="status">
                  <div>{result.message}</div>
                  {result.resetToken && (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={`${APP_ROUTES.RESET_PASSWORD}?token=${result.resetToken}`}
                      >
                        Open reset password
                        <KeyRound />
                      </a>
                    </Button>
                  )}
                </div>
              )}

              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? "Generating..." : "Generate Reset Link"}
                <Send />
              </Button>

              <Button asChild variant="ghost">
                <a href={APP_ROUTES.LOGIN}>
                  <ArrowLeft />
                  Back to login
                </a>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
