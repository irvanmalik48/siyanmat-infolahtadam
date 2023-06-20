"use client";

import { useStaleWhileRevalidate } from "@/lib/swr";
import { useSession } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface SafeUser {
  id: string;
  username: string;
  email: string;
  name: string;
  image: string;
  role: string;
}

export default function EditPasswordSection() {
  const { data: session, status } = useSession();
  const { data: profile, isLoading, mutate } = useStaleWhileRevalidate<SafeUser>(
    `/api/users/${session?.user?.email}`,
  );

  const [newPasswordError, setNewPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();
  const [oldPasswordError, setOldPasswordError] = useState<string | undefined>();

  return (
    <section className="flex flex-col w-full gap-5 mt-7">
      <h1 className="text-2xl font-bold">Edit Password</h1>
      {
        !isLoading ? (
          <Formik
            initialValues={{
              username: profile?.username,
              newPassword: "",
              confirmPassword: "",
              oldPassword: "",
            }}
            validate={(values) => {
              const errors: {
                newPassword?: string;
                confirmPassword?: string;
                oldPassword?: string;
              } = {};

              if (!values.newPassword) {
                errors.newPassword = "Harap masukkan password baru";
                setNewPasswordError(errors.newPassword);
              }

              if (values.newPassword.length < 8) {
                errors.newPassword = "Password minimal 8 karakter";
                setNewPasswordError(errors.newPassword);
              }

              if (!values.confirmPassword) {
                errors.confirmPassword = "Harap masukkan konfirmasi password";
                setConfirmPasswordError(errors.confirmPassword);
              }

              if (values.confirmPassword !== values.newPassword) {
                errors.confirmPassword = "Password dan konfirmasi password tidak cocok";
                setConfirmPasswordError(errors.confirmPassword);
              }

              if (!values.oldPassword) {
                errors.oldPassword = "Harap masukkan password lama";
                setOldPasswordError(errors.oldPassword);
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const formData = new FormData();

              formData.append("username", values.username as string);
              formData.append("password", values.newPassword as string);
              formData.append("confirmPassword", values.confirmPassword as string);
              formData.append("oldPassword", values.oldPassword as string);

              setSubmitting(true);

              const res = await fetch(`/api/users/password`, {
                method: "PATCH",
                body: formData,
              })

              const data = await res.json();

              if (!data) {
                return;
              }

              setSubmitting(false);
              resetForm();
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="flex flex-col w-full gap-5 p-5 border rounded-xl border-neutral-300">
                <Field
                  id="username"
                  name="username"
                  type="hidden"
                  className="hidden"
                />
                <motion.div
                  key="newPassword-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.newPassword && touched.newPassword ? "110px" : "70px",
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
                  <label htmlFor="newPassword" className="font-semibold">
                    Password Baru
                  </label>
                  <Field
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan password baru"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setNewPasswordError(undefined);
                    }}
                  >
                    {errors.newPassword && touched.newPassword && (
                      <motion.div
                        key="newPassword-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {newPasswordError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  key="confirmPassword-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.confirmPassword && touched.confirmPassword ? "110px" : "70px",
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
                  <label htmlFor="confirmPassword" className="font-semibold">
                    Konfirmasi Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan konfirmasi password anda"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setConfirmPasswordError(undefined);
                    }}
                  >
                    {errors.confirmPassword && touched.confirmPassword && (
                      <motion.div
                        key="email-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {confirmPasswordError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  key="oldPassword-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.oldPassword && touched.oldPassword ? "110px" : "70px",
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
                  <label htmlFor="oldPassword" className="font-semibold">
                    Password Lama
                  </label>
                  <Field
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan password lama"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setOldPasswordError(undefined);
                    }}
                  >
                    {errors.oldPassword && touched.oldPassword && (
                      <motion.div
                        key="oldPassword-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {oldPasswordError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <Field
                  id="role"
                  name="role"
                  type="hidden"
                  className="hidden"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end py-2 font-semibold text-white transition rounded-full px-7 w-fit bg-celtic-800 hover:bg-celtic-700 disabled:brightness-50"
                >
                  {
                    isSubmitting ? "Menyimpan..." : "Simpan"
                  }
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="w-full border border-neutral-300 h-[352px] rounded-xl p-5 bg-neutral-200 animate-pulse" />
        )
      }

    </section>
  );
}