import ResetPasswordForm from "./components/reset-password-form";

export default function Page() {
  return (
    <main
      className="w-full h-screen flex justify-center items-center bg-white bg-cover bg-no-repeat"
      style={{ backgroundImage: "url(/line-group.png)" }}
    >
      {" "}
      <ResetPasswordForm />{" "}
    </main>
  );
}
