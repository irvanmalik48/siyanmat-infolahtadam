"use client";

import { useStaleWhileRevalidate } from "@/lib/swr";
import { useSession } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { emailRegex } from "@/lib/rfc5322";
import Toast from "./Toast";
import { atom, useAtom } from "jotai";

interface SafeUser {
  id: string;
  username: string;
  email: string;
  name: string;
  image: string;
  role: string;
}

const onSuccessAtom = atom(false);

export default function EditProfileSection() {
  const { data: session } = useSession();
  const {
    data: profile,
    isLoading,
    mutate,
  } = useStaleWhileRevalidate<SafeUser>(`/api/users/${session?.user?.email}`);

  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [onSuccess, setOnSuccess] = useAtom(onSuccessAtom);

  return (
    <section className="mt-7 flex w-full flex-col gap-5">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      {!isLoading ? (
        <Formik
          initialValues={{
            id: profile?.id,
            name: profile?.name,
            email: profile?.email,
            username: profile?.username,
            role: profile?.role,
          }}
          validate={(values) => {
            const errors: {
              name?: string;
              email?: string;
              username?: string;
            } = {};

            if (!values.name) {
              errors.name = "Nama tidak boleh kosong";
              setNameError(errors.name);
            }

            if (!values.email) {
              errors.email = "Email tidak boleh kosong";
              setEmailError(errors.email);
            }

            if (values.email && !values.email?.match(emailRegex)) {
              errors.email = "Email tidak valid";
              setEmailError(errors.email);
            }

            if (!values.username) {
              errors.username = "Username tidak boleh kosong";
              setUsernameError(errors.username);
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();

            formData.append("id", values.id as string);
            formData.append("name", values.name as string);
            formData.append("email", values.email as string);
            formData.append("username", values.username as string);
            formData.append("role", values.role as string);

            setSubmitting(true);
            const res = await fetch(`/api/users/${session?.user?.email}`, {
              method: "PATCH",
              body: formData,
            });

            const data = await res.json();

            await mutate(data, {
              optimisticData: {
                ...(profile as SafeUser),
                name: values.name as string,
                email: values.email as string,
                username: values.username as string,
                role: values.role as string,
              },
            });

            setSubmitting(false);
            setOnSuccess(true);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <>
              <AnimatePresence onExitComplete={() => setOnSuccess(false)}>
                {onSuccess && (
                  <Toast
                    key="success"
                    message="Berhasil mengubah profil!"
                    atom={onSuccessAtom}
                  />
                )}
              </AnimatePresence>
              <Form className="flex w-full flex-col gap-5 rounded-xl border border-neutral-300 p-5">
                <Field id="id" name="id" type="hidden" className="hidden" />
                <motion.div
                  key="name-container"
                  className="flex w-full flex-col items-start justify-start gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.name && touched.name ? "110px" : "70px",
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
                  <label htmlFor="name" className="font-semibold">
                    Nama
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan nama anda"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setNameError(undefined);
                    }}
                  >
                    {errors.name && touched.name && (
                      <motion.div
                        key="name-error"
                        className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {nameError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  key="email-container"
                  className="flex w-full flex-col items-start justify-start gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.email && touched.email ? "110px" : "70px",
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
                  <label htmlFor="email" className="font-semibold">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan email anda"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setEmailError(undefined);
                    }}
                  >
                    {errors.email && touched.email && (
                      <motion.div
                        key="email-error"
                        className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {emailError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  key="username-container"
                  className="flex w-full flex-col items-start justify-start gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height:
                      errors.username && touched.username ? "110px" : "70px",
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
                <Field id="role" name="role" type="hidden" className="hidden" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-fit self-end rounded-full bg-celtic-800 px-7 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </Form>
            </>
          )}
        </Formik>
      ) : (
        <div className="h-[352px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200 p-5" />
      )}
    </section>
  );
}
