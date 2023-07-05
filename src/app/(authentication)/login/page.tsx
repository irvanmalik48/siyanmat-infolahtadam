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
      <div className="fixed top-0 left-0 z-0 w-full h-full">
        <Image
          src={BackgroundLogin}
          alt="Background Login"
          className="object-cover w-full h-full"
          placeholder="blur"
        />
      </div>
      <main className="relative z-10 flex flex-col items-center justify-between w-full max-w-4xl min-h-screen px-5 mx-auto bg-white bg-opacity-75 backdrop-blur-md">
        <div className="w-full">
          <LoginHeader />
          <section className="w-full px-5 py-12 my-auto">
            <LoginForm />
          </section>
        </div>
        <LoginFooter />
      </main>
    </>
  );
}
