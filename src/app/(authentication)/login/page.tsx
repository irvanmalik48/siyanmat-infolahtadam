import LoginHeader from "@/components/aesthetic/LoginHeader";
import LoginFooter from "@/components/aesthetic/LoginFooter";
import LoginForm from "@/components/functional/LoginForm";
import Image from "next/image";
import BackgroundLogin from "@/assets/bg-login.webp";

export const metadata = {
  title: "Login",
  description: "Login to SIYANMAT",
};

export default function Login() {
  return (
    <>
      <div className="fixed left-0 top-0 z-0 h-full w-full">
        <Image
          src={BackgroundLogin}
          alt="Background Login"
          className="h-full w-full object-cover"
          placeholder="blur"
        />
      </div>
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-between bg-white bg-opacity-75 px-5 backdrop-blur-md">
        <div className="w-full">
          <LoginHeader />
          <section className="my-auto w-full px-5 py-12">
            <LoginForm />
          </section>
        </div>
        <LoginFooter />
      </main>
    </>
  );
}
