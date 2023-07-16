"use client";

import { Formik, Form, Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import Toast from "./Toast";
import printJS from "print-js";

interface LaporanSubmit {
  sortBy: string;
  startDate: string;
  endDate: string;
  signName: string;
  nrp: string;
}

const exportSuccessAtom = atom(false);

export default function ExportActivitiesSection() {
  const [sortByError, setSortByError] = useState<string | undefined>();
  const [startDateError, setStartDateError] = useState<string | undefined>();
  const [endDateError, setEndDateError] = useState<string | undefined>();
  const [signNameError, setSignNameError] = useState<string | undefined>();
  const [nrpError, setNrpError] = useState<string | undefined>();

  const [onSuccess, setOnSuccess] = useAtom(exportSuccessAtom);

  return (
    <>
      <AnimatePresence>
        {onSuccess && (
          <Toast
            key="activity-success"
            message="Laporan berhasil diekspor!"
            atom={exportSuccessAtom}
          />
        )}
      </AnimatePresence>
      <Formik
        initialValues={{
          sortBy: "",
          startDate: new Date(
            // a week ago
            Date.now() - 7 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .slice(0, 10),
          endDate: new Date().toISOString().slice(0, 10),
          signName: "",
          nrp: "",
        }}
        validate={(values) => {
          const errors: {
            sortBy?: string;
            formatFile?: string;
            signName?: string;
            nrp?: string;
          } = {};

          if (values.sortBy === "") {
            errors.sortBy = "Anda harus memilih metode pengurutan";
            setSortByError(errors.sortBy);
          }

          if (values.signName === "") {
            errors.signName = "Kolom ini tidak boleh kosong";
            setSignNameError(errors.signName);
          }

          if (values.nrp === "") {
            errors.nrp = "Kolom ini tidak boleh kosong";
            setSignNameError(errors.nrp);
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const exportData: LaporanSubmit = {
            sortBy: values.sortBy,
            startDate: values.startDate,
            endDate: values.endDate,
            signName: values.signName,
            nrp: values.nrp,
          };

          const formData = new FormData();

          formData.append("type", "activities");
          formData.append("sortBy", exportData.sortBy);
          formData.append("signName", exportData.signName);
          formData.append("startDate", exportData.startDate);
          formData.append("endDate", exportData.endDate);
          formData.append("nrp", exportData.nrp);

          const response = await fetch("/api/export/activity/pdf", {
            method: "POST",
            body: formData,
          });

          const blob = await response.text();

          // tell browser to download the file from the response
          // without creating a new anchor element
          // the body of the response is a Buffer
          // FileSaver.saveAs(
          //   blob,
          //   `${exportData.title}.pdf`
          // );

          printJS({
            printable: blob,
            type: "raw-html",
            style:
              "@page { size: A4; margin-top: 2.03cm; margin-bottom: 1.27cm; margin-left: 2.54cm; margin-right: 1.52cm } body { font-family: sans-serif; }",
          });

          setSubmitting(false);
          setOnSuccess(true);
          resetForm();
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex flex-col w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300">
            <motion.div
              key="startDate-container"
              className="flex flex-col items-start justify-start w-full gap-1"
              initial={{
                height: "70px",
              }}
              animate={{
                height:
                  errors.startDate && touched.startDate ? "110px" : "70px",
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
                <option value="">Pilih cara pengurutan</option>
                <option value="date">Tanggal</option>
                <option value="name">Nama Kegiatan</option>
                <option value="operatorName">Nama Operator</option>
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
              key="signName-container"
              className="flex flex-col items-start justify-start w-full gap-1"
              initial={{
                height: "70px",
              }}
              animate={{
                height: errors.signName && touched.signName ? "110px" : "70px",
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
              <label htmlFor="signName" className="font-semibold">
                Nama Penandatangan
              </label>
              <Field
                id="signName"
                name="signName"
                type="text"
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                placeholder="Masukkan nama penandatangan"
              />
              <AnimatePresence
                onExitComplete={() => {
                  setSignNameError(undefined);
                }}
              >
                {errors.signName && touched.signName && (
                  <motion.div
                    key="signName-error"
                    className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {signNameError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              key="nrp-container"
              className="flex flex-col items-start justify-start w-full gap-1"
              initial={{
                height: "70px",
              }}
              animate={{
                height: errors.nrp && touched.nrp ? "110px" : "70px",
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
              <label htmlFor="nrp" className="font-semibold">
                Jabatan, Korps, dan NRP
              </label>
              <Field
                id="nrp"
                name="nrp"
                type="text"
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
                placeholder="Masukkan jabatan, korps, dan NRP"
              />
              <AnimatePresence
                onExitComplete={() => {
                  setNrpError(undefined);
                }}
              >
                {errors.nrp && touched.nrp && (
                  <motion.div
                    key="nrp-error"
                    className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {nrpError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="self-end py-2 font-semibold text-white transition rounded-full w-fit bg-celtic-800 px-7 hover:bg-celtic-700 disabled:brightness-50"
            >
              {isSubmitting ? "Memproses..." : "Cetak"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
