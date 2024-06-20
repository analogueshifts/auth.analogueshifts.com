import ResetPasswordForm from "./components/reset-password-form";
import AuthenticationLayout from "@/components/application/layouts/authentication";

export default function Page() {
  return (
    <AuthenticationLayout>
      <ResetPasswordForm />
    </AuthenticationLayout>
  );
}
