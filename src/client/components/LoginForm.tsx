import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isVisible, setIsVisible] = useState(false);

  const handleFormSubmit = (e: any) => {
    console.log("submitted");
  }

  const toggleVisibility = (e: any) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  }

  return (
    <form
      id="login-form"
      className="relative flex flex-col items-center w-full max-w-sm p-5 mx-auto bg-white overflow-clip rounded-xl"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="absolute top-0 w-full h-3.5 bg-tni-accented" />
      <h1 className="mt-2.5 text-2xl font-bold">
        Silahkan masuk untuk melanjutkan
      </h1>
      <div className="flex flex-col items-center justify-center w-full gap-1 mt-3">
        <label className="w-full text-lg font-semibold text-start" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
          placeholder="Masukkan username"
          {...register("username", { required: true })}
        />
        {errors.username?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Username tidak boleh kosong</p>}
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-1 mt-3">
        <label className="w-full text-lg font-semibold text-start" htmlFor="password">
          Password
        </label>
        <div className="flex items-center justify-start w-full gap-3">
          <input
            id="password"
            type={isVisible ? "text" : "password"}
            className="w-full px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
            placeholder="Masukkan password"
            {...register("password", { required: true })}
          />
          <button className="p-3 transition rounded-lg w-fit hover:bg-neutral-200" onClick={toggleVisibility}>
            {isVisible ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>
        {errors.password?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Password tidak boleh kosong</p>}
      </div>
      <div className="flex items-center justify-end w-full mt-5">
        <button className="px-5 py-2 font-semibold text-white transition rounded-lg bg-tni-dark hover:bg-tni-accented" type="submit">
          Login
        </button>
      </div>
    </form>
  )
}