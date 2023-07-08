"use client";

import { Formik, Form, Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import Toast from "./Toast";
import FileSaver from "file-saver";

interface LaporanSubmit {
  title: string;
  sortBy: string;
  startDate: string;
  endDate: string;
  formatFile: string;
}

const exportSuccessAtom = atom(false);

export default function ExportActivitiesSection() {
  const [titleError, setTitleError] = useState<string | undefined>();
  const [sortByError, setSortByError] = useState<string | undefined>();
  const [startDateError, setStartDateError] = useState<string | undefined>();
  const [endDateError, setEndDateError] = useState<string | undefined>();

  const [onSuccess, setOnSuccess] = useAtom(exportSuccessAtom);

  return (
    <>
      <AnimatePresence>
        {
          onSuccess && (
            <Toast
              key="activity-success"
              message="Laporan berhasil diekspor!"
              atom={exportSuccessAtom}
            />
          )
        }
      </AnimatePresence>
      <Formik
        initialValues={{
          title: "",
          sortBy: "",
          startDate: new Date(
            // a week ago
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString().slice(0, 10),
          endDate: new Date().toISOString().slice(0, 10),
          formatFile: "xlsx",
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

          if (values.sortBy === "") {
            errors.sortBy = "Silahkan pilih metode pengurutan";
            setSortByError(errors.sortBy);
          }

          return errors;
        }}

        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const exportData: LaporanSubmit = {
            title: values.title,
            sortBy: values.sortBy,
            startDate: values.startDate,
            endDate: values.endDate,
            formatFile: values.formatFile,
          };

          const formData = new FormData();

          const data = JSON.stringify({
            startDate: exportData.startDate,
            endDate: exportData.endDate,
          })

          formData.append("title", exportData.title);
          formData.append("type", "activities");
          formData.append("sortBy", exportData.sortBy);
          formData.append("formatFile", exportData.formatFile);
          formData.append("data", data);

          const response = await fetch("/api/export", {
            method: "POST",
            body: formData,
          });

          const blob = await response.blob();

          // tell browser to download the file from the response
          // without creating a new anchor element
          // the body of the response is a Buffer
          FileSaver.saveAs(blob, `${exportData.title}.${exportData.formatFile}`);

          setSubmitting(false);
          setOnSuccess(true);
          resetForm();
        }}
      >
        {({ isSubmitting, errors, touched }) => (
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
              key="startDate-container"
              className="flex flex-col items-start justify-start w-full gap-1"
              initial={{
                height: "70px",
              }}
              animate={{
                height: errors.startDate && touched.startDate ? "110px" : "70px",
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
              <label htmlFor="startDate" className="font-semibold">
                Tanggal Awal
              </label>
              <Field
                id="startDate"
                name="startDate"
                type="date"
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
              <AnimatePresence
                onExitComplete={() => {
                  setStartDateError(undefined);
                }}
              >
                {errors.startDate && touched.startDate && (
                  <motion.div
                    key="date-error"
                    className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {startDateError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              key="endDate-container"
              className="flex flex-col items-start justify-start w-full gap-1"
              initial={{
                height: "70px",
              }}
              animate={{
                height: errors.endDate && touched.endDate ? "110px" : "70px",
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
              <label htmlFor="endDate" className="font-semibold">
                Tanggal Akhir
              </label>
              <Field
                id="endDate"
                name="endDate"
                type="date"
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
              <AnimatePresence
                onExitComplete={() => {
                  setEndDateError(undefined);
                }}
              >
                {errors.endDate && touched.endDate && (
                  <motion.div
                    key="date-error"
                    className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {endDateError}
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
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                defaultValue=""
              >
                <option value="">
                  Pilih cara pengurutan
                </option>
                <option value="date">
                  Tanggal
                </option>
                <option value="activityCode">
                  Kode Kegiatan
                </option>
                <option value="toolCodeFromActivity">
                  Kode Alat
                </option>
                <option value="name">
                  Nama Kegiatan
                </option>
                <option value="operatorName">
                  Nama Operator
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
    </>
  )
}