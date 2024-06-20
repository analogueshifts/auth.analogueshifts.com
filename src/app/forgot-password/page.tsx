import ForgotPasswordForm from "./components/forgot-password-form";
import AuthenticationLayout from "@/components/application/layouts/authentication";

export default function Home() {
  return (
    <AuthenticationLayout>
      {/* Form */}
      <ForgotPasswordForm />
    </AuthenticationLayout>
  );
}
