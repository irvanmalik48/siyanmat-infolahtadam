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
  const { data: tools, isLoading } = useStaleWhileRevalidate<Tool[]>("/api/tools/get");

  const [titleError, setTitleError] = useState<string | undefined>();
  const [sortByError, setSortByError] = useState<string | undefined>();
  const [toolCodeError, setToolCodeError] = useState<string | undefined>();
  const [formatFileError, setFormatFileError] = useState<string | undefined>();

  const [onSuccess, setOnSuccess] = useAtom(exportSuccessAtom);

  return (
    <>
      <AnimatePresence>
        {
          onSuccess && (
            <Toast
              key="activity-success"
              message={`Laporan berhasil diekspor!`}
              atom={exportSuccessAtom}
            />
          )
        }
      </AnimatePresence>
      {
        !isLoading ? (
          <Formik
            initialValues={{
              title: "",
              sortBy: "",
              formatFile: "",
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

              if (values.formatFile === "") {
                errors.formatFile = "Silahkan pilih format file";
                setFormatFileError(errors.formatFile);
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
              formData.append("type", exportData.toolCode === "all" ? "tools" : "tool");
              formData.append("sortBy", exportData.toolCode === "all" ? exportData.sortBy : "none");
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
              FileSaver.saveAs(blob, `${exportData.title}.xlsx`);

              setSubmitting(false);
              setOnSuccess(true);
              resetForm();
            }}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="flex flex-col w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300">
                <motion.div
                  key="title-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
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
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
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
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
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
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.toolCode && touched.toolCode ? "110px" : "70px",
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
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    defaultValue="all"
                  >
                    <option value="all">
                      Semua
                    </option>
                    {
                      tools?.map((tool) => (
                        <option key={tool.id} value={tool.toolCode}>
                          {tool.name} - {tool.brand}
                        </option>
                      ))
                    }
                  </Field>
                  <AnimatePresence
                    onExitComplete={() => {
                      setToolCodeError(undefined);
                    }}
                  >
                    {errors.toolCode && touched.toolCode && (
                      <motion.div
                        key="toolCode-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
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
                  className="flex flex-col items-start justify-start w-full gap-1"
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
                    className="w-full px-5 py-2 transition border rounded-lg outline-none disabled:brightness-75 disabled:cursor-not-allowed border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    defaultValue=""
                    disabled={values.toolCode !== "all"}
                  >
                    <option value="">
                      Pilih cara pengurutan
                    </option>
                    <option value="toolCode">
                      Kode Alat
                    </option>
                    <option value="name">
                      Nama Alat
                    </option>
                    <option value="brand">
                      Merek Alat
                    </option>

                  </Field>
                  <AnimatePresence
                    onExitComplete={() => {
                      setSortByError(undefined);
                    }}
                  >
                    {errors.sortBy && touched.sortBy && (
                      <motion.div
                        key="sortBy-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {sortByError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  key="formatFile-container"
                  className="flex flex-col items-start justify-start w-full gap-1"
                  initial={{
                    height: "70px",
                  }}
                  animate={{
                    height: errors.formatFile && touched.formatFile ? "110px" : "70px",
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
                  <label htmlFor="formatFile" className="font-semibold">
                    Format
                  </label>
                  <Field
                    id="formatFile"
                    name="formatFile"
                    as="select"
                    className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                    defaultValue=""
                  >
                    <option value="">
                      Pilih format file
                    </option>
                    <option value="xlsx">
                      Excel (*.xlsx)
                    </option>
                    <option value="csv">
                      CSV (*.csv)
                    </option>
                  </Field>
                  <AnimatePresence
                    onExitComplete={() => {
                      setSortByError(undefined);
                    }}
                  >
                    {errors.formatFile && touched.formatFile && (
                      <motion.div
                        key="formatFile-error"
                        className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {formatFileError}
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
                    isSubmitting ? "Memproses..." : "Cetak"
                  }
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="w-full h-[440px] bg-neutral-200 animate-pulse p-5 mt-8 border rounded-xl border-neutral-300" />
        )
      }
    </>
  )
}