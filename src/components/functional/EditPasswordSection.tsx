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
  const {
    data: profile,
    isLoading,
    mutate,
  } = useStaleWhileRevalidate<SafeUser>(`/api/users/${session?.user?.email}`);

  const [newPasswordError, setNewPasswordError] = useState<
    string | undefined
  >();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >();
  const [oldPasswordError, setOldPasswordError] = useState<
    string | undefined
  >();

  return (
    <section className="mt-7 flex w-full flex-col gap-5">
      <h1 className="text-2xl font-bold">Edit Password</h1>
      {!isLoading ? (
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
              errors.confirmPassword =
                "Password dan konfirmasi password tidak cocok";
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
            formData.append(
              "confirmPassword",
              values.confirmPassword as string
            );
            formData.append("oldPassword", values.oldPassword as string);

            setSubmitting(true);

            const res = await fetch(`/api/users/password`, {
              method: "PATCH",
              body: formData,
            });

            const data = await res.json();

            if (!data) {
              return;
            }

            setSubmitting(false);
            resetForm();
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex w-full flex-col gap-5 rounded-xl border border-neutral-300 p-5">
              <Field
                id="username"
                name="username"
                type="hidden"
                className="hidden"
              />
              <motion.div
                key="newPassword-container"
                className="flex w-full flex-col items-start justify-start gap-1"
                initial={{
                  height: "70px",
                }}
                animate={{
                  height:
                    errors.newPassword && touched.newPassword
                      ? "110px"
                      : "70px",
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
                  className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
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
                      className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
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
                className="flex w-full flex-col items-start justify-start gap-1"
                initial={{
                  height: "70px",
                }}
                animate={{
                  height:
                    errors.confirmPassword && touched.confirmPassword
                      ? "110px"
                      : "70px",
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
                  className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
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
                      className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
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
                className="flex w-full flex-col items-start justify-start gap-1"
                initial={{
                  height: "70px",
                }}
                animate={{
                  height:
                    errors.oldPassword && touched.oldPassword
                      ? "110px"
                      : "70px",
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
                  className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
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
                      className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {oldPasswordError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <Field id="role" name="role" type="hidden" className="hidden" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-fit self-end rounded-full bg-celtic-800 px-7 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="h-[352px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200 p-5" />
      )}
    </section>
  );
}
