import AuthenticationLayout from "@/components/application/layouts/authentication";
import EmailVerificationForm from "./components/email-verification-form";

export default function Page() {
  return (
    <AuthenticationLayout>
      <EmailVerificationForm />
    </AuthenticationLayout>
  );
}
