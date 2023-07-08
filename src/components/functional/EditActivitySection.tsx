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

interface ActivitySubmit {
  activityCode: string;
  name: string;
  description: string;
  date: string;
  operatorName: string;
  toolUsage: number;
  toolCode: string[];
}

const toolSuccessAtom = atom(false);

export default function EditActivitySection({ code }: { code: string }) {
  const { data: activity, isLoading: isLoading } = useStaleWhileRevalidate<ActivitySubmit & {
    tools: {
      activityId: string;
      toolId: string;
      tool: Tool;
    }[]
  }>(`/api/activities/${code}`);
  const { data: tools, isLoading: isLoadingTools } = useStaleWhileRevalidate<Tool[]>("/api/tools/get");
  const router = useRouter();

  const [activityCodeError, setActivityCodeError] = useState<string | undefined>("");
  const [nameError, setNameError] = useState<string | undefined>("");
  const [dateError, setDateError] = useState<string | undefined>("");
  const [operatorNameError, setOperatorNameError] = useState<string | undefined>("");
  const [toolUsageError, setToolUsageError] = useState<string | undefined>("");

  const [amountOfTools, setAmountOfTools] = useState<number>(0);

  const [onSuccess, setOnSuccess] = useAtom(toolSuccessAtom);

  return (
    <>
      <AnimatePresence>
        {
          onSuccess && (
            <Toast
              key="activity-success"
              message="Kegiatan berhasil diubah"
              atom={toolSuccessAtom}
            />
          )
        }
      </AnimatePresence>
      {
        !isLoading && !isLoadingTools ? (
          <Formik
            initialValues={{
              activityCode: activity?.activityCode,
              name: activity?.name,
              description: activity?.description,
              date: new Date(activity?.date as string).toISOString().slice(0, 10),
              operatorName: activity?.operatorName,
              toolCode: activity?.tools.map((tool) => tool.tool.toolCode),
              toolUsage: activity?.toolUsage,
            }}
            validate={(values) => {
              const errors: {
                activityCode?: string;
                name?: string;
                date?: string;
                operatorName?: string;
                toolCode?: string;
                toolUsage?: string;
              } = {};

              if (!values.activityCode) {
                errors.activityCode = "Kode kegiatan harus diisi";
                setActivityCodeError(errors.activityCode);
              }

              if (!values.name) {
                errors.name = "Nama kegiatan harus diisi";
                setNameError(errors.name);
              }

              if (!values.date) {
                errors.date = "Tanggal kegiatan harus diisi";
                setDateError(errors.date);
              }

              if (!values.operatorName) {
                errors.operatorName = "Nama operator harus diisi";
                setOperatorNameError(errors.operatorName);
              }

              if (!values.toolUsage) {
                errors.toolUsage = "Nominal jam pakai harus diisi";
                setToolUsageError(errors.toolUsage);
              }

              return errors;
            }}

            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const activityData: ActivitySubmit = {
                activityCode: values.activityCode as string,
                name: values.name as string,
                description: values.description as string,
                date: values.date as string,
                operatorName: values.operatorName as string,
                toolCode: values.toolCode as string[],
                toolUsage: Number(values.toolUsage),
              };

              const formData = new FormData();

              formData.append("activityCode", activityData.activityCode);
              formData.append("name", activityData.name);
              formData.append("description", activityData.description === "" ? "Tidak ada deskripsi" : activityData.description);
              formData.append("date", activityData.date);
              formData.append("operatorName", activityData.operatorName);
              formData.append("toolCode", activityData.toolCode.join(","));
              formData.append("toolUsage", activityData.toolUsage.toString());

              const response = await fetch(`/api/activities/${code}`, {
                method: "PATCH",
                body: formData,
              });

              const responseJson = await response.json();

              await definedMutator("/api/activities/get");

              setSubmitting(false);
              setOnSuccess(true);
              resetForm();
              router.push("/activities");
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="flex flex-col w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300">
                <motion.div
                  key="activityCode-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.activityCode && touched.activityCode ? "110px" : "70px",
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
                  <label htmlFor="activityCode" className="font-semibold">
                    Kode Kegiatan
                  </label>
                  <Field
                    id="activityCode"
                    name="activityCode"
                    type="text"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan kode kegiatan (i.e. KG-0001)"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setActivityCodeError(undefined);
                    }}
                  >
                    {errors.activityCode && touched.activityCode && (
                      <motion.div
                        key="activityCode-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {activityCodeError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  key="name-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
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
                    Nama Kegiatan
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan nama kegiatan"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setActivityCodeError(undefined);
                    }}
                  >
                    {errors.name && touched.name && (
                      <motion.div
                        key="name-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {nameError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div
                  key="description-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                >
                  <label htmlFor="description" className="font-semibold">
                    Deskripsi
                  </label>
                  <Field
                    id="description"
                    name="description"
                    type="text"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan deskripsi kegiatan (opsional)"
                  />
                </div>
                <motion.div
                  key="date-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.date && touched.date ? "110px" : "70px",
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
                    Tanggal Kegiatan
                  </label>
                  <Field
                    id="date"
                    name="date"
                    type="date"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setActivityCodeError(undefined);
                    }}
                  >
                    {errors.date && touched.date && (
                      <motion.div
                        key="date-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {dateError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div
                  className="flex flex-col items-start justify-start w-full gap-1"
                >
                  <label htmlFor="toolCode[]" className="font-semibold">
                    Alat yang Digunakan
                  </label>
                  {
                    Array.from({ length: amountOfTools === 0 ? activity?.tools.length as number : amountOfTools }, (_, i) => i).map((i) => (
                      <Field
                        key={i}
                        id="toolCode[]"
                        name={`toolCode[${i}]`}
                        as="select"
                        className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                        defaultValue=""
                      >
                        <option value="">
                          Pilih alat {i + 1}
                        </option>
                        {
                          tools?.map((tool) => (
                            <option key={tool.id} value={tool.toolCode}>
                              {tool.name} - {tool.brand}
                            </option>
                          ))
                        }
                      </Field>
                    ))
                  }
                  <button
                    disabled={isSubmitting}
                    className="self-end w-full py-2 font-semibold text-white transition rounded-full px-7 bg-celtic-800 hover:bg-celtic-700 disabled:brightness-50"
                    onClick={(e) => {
                      e.preventDefault();
                      setAmountOfTools(amountOfTools === 0 ? activity?.tools.length as number : amountOfTools + 1);
                    }}
                  >
                    Tambah Alat
                  </button>
                </div>
                <motion.div
                  key="operatorName-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.operatorName && touched.operatorName ? "110px" : "70px",
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
                  <label htmlFor="operatorName" className="font-semibold">
                    Nama Operator
                  </label>
                  <Field
                    id="operatorName"
                    name="operatorName"
                    type="text"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    placeholder="Masukkan nama operator"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setNameError(undefined);
                    }}
                  >
                    {errors.operatorName && touched.operatorName && (
                      <motion.div
                        key="operatorName-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {operatorNameError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  key="toolUsage-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.toolUsage && touched.toolUsage ? "110px" : "70px",
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
                  <label htmlFor="toolUsage" className="font-semibold">
                    Nominal Waktu Pemakaian (jam)
                  </label>
                  <Field
                    id="toolUsage"
                    name="toolUsage"
                    type="number"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                  />
                  <AnimatePresence
                    onExitComplete={() => {
                      setToolUsageError(undefined);
                    }}
                  >
                    {errors.toolUsage && touched.toolUsage && (
                      <motion.div
                        key="toolUsage-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {toolUsageError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
          <div className="w-full h-[710px] bg-neutral-200 animate-pulse p-5 mt-8 border rounded-xl border-neutral-300" />
        )
      }
    </>
  )
}