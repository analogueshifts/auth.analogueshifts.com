import LoginForm from "./components/login-form";

export default function Home() {
  return (
    <main
      className="w-full h-screen flex justify-center items-center bg-white bg-cover bg-no-repeat"
      style={{ backgroundImage: "url(/line-group.png)" }}
    >
      <LoginForm />
    </main>
  );
}
