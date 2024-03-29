"use client";

import { Formik, Form, Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import { useStaleWhileRevalidate } from "@/lib/swr";
import Toast from "./Toast";
import { Tool } from "@prisma/client";
import { useRouter } from "next/navigation";
import { mutate as definedMutator } from "swr";

interface ToolEditSubmit {
  toolCode: string;
  name: string;
  brand: string;
  maxHourUsage: number;
  condition: string;
}

const toolSuccessAtom = atom(false);

export default function EditToolSection({ code }: { code: string }) {
  const {
    data: tool,
    isLoading,
    mutate,
  } = useStaleWhileRevalidate<Tool>(`/api/tools/${code}`);
  const [toolCodeError, setToolCodeError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [maxHourUsageError, setMaxHourUsageError] = useState<
    string | undefined
  >();
  const [imageError, setImageError] = useState<string | undefined>();
  const router = useRouter();

  const [fileData, setFileData] = useState<File>();

  const [onSuccess, setOnSuccess] = useAtom(toolSuccessAtom);

  return (
    <>
      <AnimatePresence>
        {onSuccess && (
          <Toast
            key="tool-success"
            message="Berhasil mengubah keterangan alat"
            atom={toolSuccessAtom}
          />
        )}
      </AnimatePresence>
      {!isLoading ? (
        <>
          <Formik
            initialValues={{
              toolCode: tool?.toolCode as string,
              image: undefined,
            }}
            validate={(values) => {
              const errors: {
                toolCode?: string;
                image?: string;
              } = {};

              if (!values.toolCode) {
                errors.toolCode = "Harap masukkan kode alat";
                setToolCodeError(errors.toolCode);
              }

              if (fileData === undefined) {
                errors.image = "Harap masukkan gambar alat";
                setImageError(errors.image);
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const imageData = fileData;

              if (!(imageData instanceof File)) {
                return;
              }

              const imageUploadForm = new FormData();

              imageUploadForm.append("image", imageData as File);

              const imageUrl = await fetch(
                `/api/upload?type=tool&toolCode=${values.toolCode}`,
                {
                  method: "POST",
                  body: imageUploadForm,
                }
              );

              const imageUrlJSON = await imageUrl.json();

              const formData = new FormData();

              formData.append("toolCode", values.toolCode);
              formData.append("image", imageUrlJSON.imageUrl);

              const response = await fetch("/api/tools/update-image", {
                method: "PUT",
                body: formData,
              });

              const responseJSON = await response.json();

              await mutate(responseJSON);

              setOnSuccess(true);
              resetForm();
              setSubmitting(false);
              router.push("/tools");
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="mt-8 flex w-full flex-col gap-5 rounded-xl border border-neutral-300 p-5">
                <motion.div
                  key="image-container"
                  className="flex w-full flex-col items-start justify-start gap-1"
                  initial={{
                    height: "86px",
                  }}
                  animate={{
                    height: errors.image && touched.image ? "126px" : "86px",
                  }}
                  exit={{
                    height: "86px",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    height: {
                      duration: 0.3,
                    },
                  }}
                >
                  <label htmlFor="image" className="font-semibold">
                    Gambar Alat
                  </label>
                  <div className="w-full rounded-lg border border-neutral-300 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50">
                    <Field
                      id="image"
                      name="image"
                      type="file"
                      className="w-full p-2 outline-none file:mr-3 file:inline-block file:cursor-pointer file:rounded-full file:border-none file:bg-celtic-800 file:px-5 file:py-2 file:font-sans file:font-semibold file:text-white file:transition file:hover:bg-celtic-700"
                      placeholder="Masukkan gambar alat"
                      onChange={(event: any) => {
                        if (event.currentTarget.files) {
                          const file = event.currentTarget.files[0];
                          const allowedExtensions = ["jpg", "jpeg", "png"];
                          const fileExtension = file.name.split(".").pop();
                          if (!allowedExtensions.includes(fileExtension)) {
                            setImageError("Ekstensi file tidak didukung");
                          } else {
                            setImageError(undefined);
                          }
                        }

                        setFileData(event.currentTarget.files[0]);
                      }}
                    />
                  </div>
                  <AnimatePresence
                    onExitComplete={() => {
                      setImageError(undefined);
                    }}
                  >
                    {errors.image && touched.image && (
                      <motion.div
                        key="image-error"
                        className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {imageError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-fit self-end rounded-full bg-celtic-800 px-7 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Update"}
                </button>
              </Form>
            )}
          </Formik>
          <Formik
            initialValues={{
              id: tool?.id as string,
              toolCode: code,
              name: tool?.name as string,
              brand: tool?.brand as string,
              maxHourUsage: tool?.maxHourUsage as number,
              condition: tool?.condition as string,
            }}
            validate={(values) => {
              const errors: {
                toolCode?: string;
                name?: string;
                maxHourUsage?: string;
                image?: string;
              } = {};

              if (!values.toolCode) {
                errors.toolCode = "Harap masukkan kode alat";
                setToolCodeError(errors.toolCode);
              }

              if (!values.name) {
                errors.name = "Harap masukkan nama alat";
                setNameError(errors.name);
              }

              if (values.maxHourUsage < 0) {
                errors.maxHourUsage =
                  "Maksimal jam penggunaan tidak boleh kurang dari 0";
                setMaxHourUsageError(errors.maxHourUsage);
              }

              if (values.maxHourUsage === 0) {
                errors.maxHourUsage = "Maksimal jam penggunaan tidak boleh 0";
                setMaxHourUsageError(errors.maxHourUsage);
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const toolData: ToolEditSubmit = {
                toolCode: values.toolCode,
                name: values.name,
                brand: values.brand,
                maxHourUsage: values.maxHourUsage,
                condition: values.condition,
              };

              const formData = new FormData();

              formData.append("toolCode", toolData.toolCode);
              formData.append("name", toolData.name);
              formData.append("brand", toolData.brand);
              formData.append("maxHourUsage", toolData.maxHourUsage.toString());
              formData.append("condition", toolData.condition);

              const response = await fetch(`/api/tools/${code}`, {
                method: "PATCH",
                body: formData,
              });

              const responseJson = await response.json();

              await mutate(responseJson);

              await definedMutator("/api/tools/get?all");

              setSubmitting(false);
              setOnSuccess(true);
              resetForm();
              router.push("/tools");
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="mt-5 flex w-full flex-col gap-5 rounded-xl border border-neutral-300 p-5">
                <motion.div
                  key="toolCode-container"
                  className="flex w-full flex-col items-start justify-start gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height:
                      errors.toolCode && touched.toolCode ? "110px" : "70px",
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
                  <label htmlFor="toolCode" className="font-semibold">
                    Kode Alat
                  </label>
                  <Field
                    id="toolCode"
                    name="toolCode"
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan kode alat (i.e. AL-0001)"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setToolCodeError(undefined);
                    }}
                  >
                    {errors.toolCode && touched.toolCode && (
                      <motion.div
                        key="toolCode-error"
                        className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {toolCodeError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
                    Nama Alat
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan nama alat"
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
                <div className="flex w-full flex-col items-start justify-start gap-1">
                  <label htmlFor="brand" className="font-semibold">
                    Merek Alat
                  </label>
                  <Field
                    id="brand"
                    name="brand"
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan merek alat (kosongkan jika tidak ada merek)"
                  />
                </div>
                <motion.div
                  key="maxHourUsage-container"
                  className="flex w-full flex-col items-start justify-start gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height:
                      errors.maxHourUsage && touched.maxHourUsage
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
                  <label htmlFor="maxHourUsage" className="font-semibold">
                    Maks Usia Pemakaian (jam)
                  </label>
                  <Field
                    id="maxHourUsage"
                    name="maxHourUsage"
                    type="number"
                    className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setMaxHourUsageError(undefined);
                    }}
                  >
                    {errors.maxHourUsage && touched.maxHourUsage && (
                      <motion.div
                        key="maxHourUsage-error"
                        className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {maxHourUsageError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div className="flex w-full flex-col items-start justify-start gap-1">
                  <label htmlFor="condition" className="font-semibold">
                    Kondisi Alat
                  </label>
                  <Field
                    id="condition"
                    name="condition"
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan kondisi alat (B/RB/RR)"
                  />
                </div>
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
        </>
      ) : (
        <>
          <div className="mt-8 h-[186px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200 p-5" />
          <div className="mt-5 h-[484px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200 p-5" />
        </>
      )}
    </>
  );
}
