import LoginLayout from "@/components/LoginLayout";
import { Eye, EyeOff } from "lucide-react";
import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type ILogin } from "@/common/validation/auth";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    router.push("/dashboard");
  }

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ILogin>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(loginSchema),
  });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = (e: any) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  }

  const onSubmit = useCallback(async (data: ILogin) => {
    try {
      await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
      reset();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <LoginLayout
      title="Login"
      description="Login page"
    >
      <section className="w-full min-h-[60vh] place-content-center grid px-5 py-12 bg-camo bg-center">
        <form
          id="login-form"
          className="relative flex flex-col items-center w-full max-w-sm p-5 mx-auto bg-white overflow-clip rounded-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="absolute top-0 w-full h-3.5 bg-tni-accented" />
          <h1 className="mt-2.5 text-2xl font-bold">
            Silahkan masuk untuk melanjutkan
          </h1>
          <div className="flex flex-col items-center justify-center w-full gap-1 mt-3">
            <label className="w-full text-lg font-semibold text-start" htmlFor="email">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  id="email"
                  type="text"
                  className="w-full px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
                  placeholder="Masukkan email"
                  {...field}
                />
              )}
            />
            {errors.email?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Email tidak boleh kosong</p>}
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-1 mt-3">
            <label className="w-full text-lg font-semibold text-start" htmlFor="password">
              Password
            </label>
            <div className="flex items-center justify-start w-full gap-3">
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    className="w-full px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
                    placeholder="Masukkan password"
                    {...field}
                  />
                )}
              />
              <button className="p-3 transition rounded-lg w-fit hover:bg-neutral-200" onClick={toggleVisibility}>
                {isVisible ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
            {errors.password?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Password tidak boleh kosong</p>}
          </div>
          <div className="flex items-center justify-end w-full mt-5">
            <button className="px-5 py-2 font-semibold text-white transition rounded-lg active:scale-90 bg-tni-dark hover:bg-tni-accented" type="submit">
              Login
            </button>
          </div>
        </form>
      </section>
    </LoginLayout>
  )
}
