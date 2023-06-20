import LoginHeader from "@/components/aesthetic/LoginHeader";
import LoginFooter from "@/components/aesthetic/LoginFooter";
import LoginForm from "@/components/functional/LoginForm";

export const metadata = {
  title: "Login",
  description: "Login to SIYANMAT",
};

export default function Login() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between">
      <div className="w-full">
        <LoginHeader />
        <section className="my-auto w-full px-5 py-12">
          <LoginForm />
        </section>
      </div>
      <LoginFooter />
    </main>
  );
}
