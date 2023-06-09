"use client";

import { Formik, Form, Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import Toast from "./Toast";
import FileSaver from "file-saver";
import { useStaleWhileRevalidate } from "@/lib/swr";
import { Tool } from "@prisma/client";

interface LaporanSubmit {
  title: string;
  sortBy: string;
  toolCode: string;
  formatFile: string;
}

const exportSuccessAtom = atom(false);

export default function ExportToolsSection() {
  const { data: tools, isLoading } =
    useStaleWhileRevalidate<Tool[]>("/api/tools/get");

  const [titleError, setTitleError] = useState<string | undefined>();
  const [sortByError, setSortByError] = useState<string | undefined>();
  const [toolCodeError, setToolCodeError] = useState<string | undefined>();

  const [onSuccess, setOnSuccess] = useAtom(exportSuccessAtom);

  return (
    <>
      <AnimatePresence>
        {onSuccess && (
          <Toast
            key="activity-success"
            message={`Laporan berhasil diekspor!`}
            atom={exportSuccessAtom}
          />
        )}
      </AnimatePresence>
      {!isLoading ? (
        <Formik
          initialValues={{
            title: "",
            sortBy: "",
            formatFile: "xlsx",
            toolCode: "all",
          }}
          validate={(values) => {
            const errors: {
              title?: string;
              sortBy?: string;
              formatFile?: string;
            } = {};

            if (values.title === "") {
              errors.title = "Judul tidak boleh kosong";
              setTitleError(errors.title);
            }

            if (values.toolCode === "all" && values.sortBy === "") {
              errors.sortBy = "Silahkan pilih metode pengurutan";
              setSortByError(errors.sortBy);
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const exportData: LaporanSubmit = {
              title: values.title,
              sortBy: values.sortBy,
              formatFile: values.formatFile,
              toolCode: values.toolCode,
            };

            const formData = new FormData();

            formData.append("title", exportData.title);
            formData.append(
              "type",
              exportData.toolCode === "all" ? "tools" : "tool"
            );
            formData.append(
              "sortBy",
              exportData.toolCode === "all" ? exportData.sortBy : "none"
            );
            formData.append("formatFile", exportData.formatFile);
            formData.append("data", exportData.toolCode);

            const response = await fetch("/api/export", {
              method: "POST",
              body: formData,
            });

            const blob = await response.blob();

            // tell browser to download the file from the response
            // without creating a new anchor element
            // the body of the response is a Buffer
            FileSaver.saveAs(
              blob,
              `${exportData.title}.${exportData.formatFile}`
            );

            setSubmitting(false);
            setOnSuccess(true);
            resetForm();
          }}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form className="mt-8 flex w-full flex-col gap-5 rounded-xl border border-neutral-300 p-5">
              <motion.div
                key="title-container"
                className="flex w-full flex-col items-start justify-start gap-1"
                initial={{
                  height: "70px",
                }}
                animate={{
                  height: errors.title && touched.title ? "110px" : "70px",
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
                <label htmlFor="title" className="font-semibold">
                  Nama Laporan
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                  placeholder="Masukkan nama laporan"
                />
                <AnimatePresence
                  onExitComplete={() => {
                    setTitleError(undefined);
                  }}
                >
                  {errors.title && touched.title && (
                    <motion.div
                      key="name-error"
                      className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {titleError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
                  Peralatan
                </label>
                <Field
                  id="toolCode"
                  name="toolCode"
                  as="select"
                  className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                  defaultValue="all"
                >
                  <option value="all">Semua</option>
                  {tools?.map((tool) => (
                    <option key={tool.id} value={tool.toolCode}>
                      {tool.name} - {tool.brand}
                    </option>
                  ))}
                </Field>
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
                key="sortBy-container"
                className="flex w-full flex-col items-start justify-start gap-1"
                initial={{
                  height: "70px",
                }}
                animate={{
                  height: errors.sortBy && touched.sortBy ? "110px" : "70px",
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
                <label htmlFor="sortBy" className="font-semibold">
                  Urutkan melalui
                </label>
                <Field
                  id="sortBy"
                  name="sortBy"
                  as="select"
                  className="w-full rounded-lg border border-neutral-300 px-5 py-2 outline-none ring-4 ring-transparent transition focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:brightness-75"
                  defaultValue=""
                  disabled={values.toolCode !== "all"}
                >
                  <option value="">Pilih cara pengurutan</option>
                  <option value="toolCode">Kode Alat</option>
                  <option value="name">Nama Alat</option>
                  <option value="brand">Merek Alat</option>
                </Field>
                <AnimatePresence
                  onExitComplete={() => {
                    setSortByError(undefined);
                  }}
                >
                  {errors.sortBy && touched.sortBy && (
                    <motion.div
                      key="sortBy-error"
                      className="w-full rounded-lg bg-red-400 bg-opacity-10 px-5 py-2 text-sm text-red-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {sortByError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-fit self-end rounded-full bg-celtic-800 px-7 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-50"
              >
                {isSubmitting ? "Memproses..." : "Cetak"}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="mt-8 h-[440px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200 p-5" />
      )}
    </>
  );
}
