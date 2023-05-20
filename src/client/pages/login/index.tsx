import LoginLayout from "../../layouts/LoginLayout";
import LoginForm from "../../components/LoginForm";

export default function Login() {
  return (
    <LoginLayout
      title="Login"
      description="Login page"
    >
      <section className="w-full min-h-[60vh] place-content-center grid px-5 py-12 bg-camo bg-center">
        <LoginForm />
      </section>
    </LoginLayout>
  )
}