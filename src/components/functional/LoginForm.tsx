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
        <Form className="flex flex-col items-center justify-center w-full max-w-xl gap-5 p-5 m-auto bg-white rounded-xl">
          <h1 className="w-full text-2xl font-bold text-center">
            Silahkan masuk untuk melanjutkan
          </h1>
          <motion.div
            key="username-container"
            className="flex flex-col items-start justify-start w-full gap-1"
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
              className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
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
                  className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {usernameError}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="flex flex-col items-start justify-center w-full gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <motion.div
              key="password-container"
              className="flex flex-col items-start justify-start w-full gap-1"
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
              <div className="flex items-center justify-start w-full gap-2">
                <Field
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="flex items-center justify-center w-10 h-10 transition border rounded-lg border-neutral-300 hover:bg-neutral-100 active:bg-neutral-200"
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
                    className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
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
            className="self-end py-2 mt-5 font-semibold text-white transition rounded-full w-fit bg-celtic-800 px-7 hover:bg-celtic-700 disabled:brightness-75"
          >
            {isSubmitting ? "Loading..." : "Masuk"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
