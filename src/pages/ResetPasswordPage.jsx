import { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { BrandWordmark } from "@/components/site/BrandWordmark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardHeading, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_ROUTES } from "@/routes";
import { gymApi } from "@/services/gymApiService";
import "./PasswordRecovery.css";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token") || "";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    setError("");
    setSuccess("");

    if (!resetToken) {
      setError("Reset token missing hai. Naya reset link generate karo.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords match nahi kar rahe.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await gymApi.resetPassword(resetToken, password);
      setSuccess(response.message);
      form.reset();
    } catch (requestError) {
      setError(requestError.message || "Password reset nahi ho paaya.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="password-recovery-page section-block">
      <div className="container relative z-10">
        <Card className="password-recovery-card">
          <CardHeader>
            <CardHeading>
              <div className="password-recovery-brand">
                <BrandWordmark tone="dark" />
              </div>
              <CardTitle className="mt-4">Reset password</CardTitle>
              <CardDescription>
                Strong password set karo. Reset ke baad purane login sessions invalid ho jayenge.
              </CardDescription>
            </CardHeading>
            <div className="password-recovery-icon">
              <LockKeyhole className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="password-recovery-label" htmlFor="reset-password">New password</label>
                <Input
                  id="reset-password"
                  name="password"
                  type="password"
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <label className="password-recovery-label" htmlFor="reset-confirm-password">Confirm password</label>
                <Input
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && <div className="password-recovery-error">{error}</div>}
              {success && (
                <div className="password-recovery-success" role="status">
                  <CheckCircle2 className="size-4" />
                  <div>{success}</div>
                </div>
              )}

              {!success && (
                <Button type="submit" size="lg" disabled={submitting || !resetToken}>
                  {submitting ? "Resetting..." : "Reset Password"}
                  <KeyRound />
                </Button>
              )}

              <Button asChild variant={success ? "primary" : "ghost"}>
                <a href={APP_ROUTES.LOGIN}>
                  <ArrowLeft />
                  {success ? "Login with new password" : "Back to login"}
                </a>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
