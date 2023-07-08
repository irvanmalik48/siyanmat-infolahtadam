"use client";

import { Formik, Field, Form } from "formik";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoginForm() {
  const [visible, setVisible] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validate={(values) => {
        const errors: {
          username?: string;
          password?: string;
        } = {};

        if (!values.username) {
          errors.username = "Harap masukkan username";
          setUsernameError(errors.username);
        }

        if (values.password.length < 8) {
          errors.password = "Password minimal 8 karakter";
          setPasswordError(errors.password);
        }

        if (!values.password) {
          errors.password = "Harap masukkan password";
          setPasswordError(errors.password);
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        signIn("credentials", {
          username: values.username,
          password: values.password,
          callbackUrl: "/",
        });
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="m-auto flex w-full max-w-xl flex-col items-center justify-center gap-5 rounded-xl bg-white p-5">
          <h1 className="w-full text-center text-2xl font-bold">
            Silahkan masuk untuk melanjutkan
          </h1>
          <motion.div
            key="username-container"
            className="flex w-full flex-col items-start justify-start gap-1"
            initial={{
              height: "70px",
            }}
            animate={{
              height: errors.username && touched.username ? "110px" : "70px",
            }}
            exit={{
              height: "70px",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              height: {
                duration: 0.3,
              },
            }}
          >
            <label htmlFor="username" className="font-semibold">
              Username
            </label>
            <Field
              id="username"
              name="username"
              type="text"
              className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
              placeholder="Masukkan username"
            />
            <AnimatePresence
              onExitComplete={() => {
                setUsernameError(undefined);
              }}
            >
              {errors.username && touched.username && (
                <motion.div
                  key="username-error"
                  className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {usernameError}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="flex w-full flex-col items-start justify-center gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <motion.div
              key="password-container"
              className="flex w-full flex-col items-start justify-start gap-1"
              initial={{
                height: "70px",
              }}
              animate={{
                height: errors.password && touched.password ? "110px" : "70px",
              }}
              exit={{
                height: "70px",
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                height: {
                  duration: 0.3,
                },
              }}
            >
              <div className="flex w-full items-center justify-start gap-2">
                <Field
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 transition hover:bg-neutral-100 active:bg-neutral-200"
                >
                  {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <AnimatePresence
                onExitComplete={() => {
                  setPasswordError(undefined);
                }}
              >
                {errors.password && touched.password && (
                  <motion.div
                    key="password-error"
                    className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {passwordError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-fit self-end rounded-full bg-celtic-800 px-7 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-75"
          >
            {isSubmitting ? "Loading..." : "Masuk"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
