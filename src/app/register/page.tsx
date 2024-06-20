import AuthenticationLayout from "@/components/application/layouts/authentication";
import RegisterForm from "./components/register-form";

export default function Page() {
  return (
    <AuthenticationLayout>
      <RegisterForm />
    </AuthenticationLayout>
  );
}
