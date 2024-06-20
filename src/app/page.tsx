import LoginForm from "./login-form";
import AuthenticationLayout from "@/components/application/layouts/authentication";

export default function Home() {
  return (
    <AuthenticationLayout>
      {/* Form */}
      <LoginForm />
    </AuthenticationLayout>
  );
}
