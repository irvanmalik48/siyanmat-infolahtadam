"use client";

import { Formik, Form, Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import Toast from "./Toast";

interface ToolSubmit {
  toolCode: string;
  name: string;
  maxHourUsage: number;
  image: string;
  isAvailable: boolean;
}

const toolSuccessAtom = atom(false);

export default function AddToolSection() {
  const [toolCodeError, setToolCodeError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [maxHourUsageError, setMaxHourUsageError] = useState<string | undefined>();
  const [imageError, setImageError] = useState<string | undefined>();

  const [fileData, setFileData] = useState<File>();

  const [onSuccess, setOnSuccess] = useAtom(toolSuccessAtom);

  return (
    <>
      <AnimatePresence>
        {
          onSuccess && (
            <Toast
              key="tool-success"
              message="Alat berhasil ditambahkan"
              atom={toolSuccessAtom}
            />
          )
        }
      </AnimatePresence>
      <Formik
        initialValues={{
          toolCode: "",
          name: "",
          maxHourUsage: 0,
          image: undefined,
          isAvailable: true,
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
            errors.maxHourUsage = "Maksimal jam penggunaan tidak boleh kurang dari 0";
            setMaxHourUsageError(errors.maxHourUsage);
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

          const imageUrl = await fetch("/api/upload?type=tool", {
            method: "POST",
            body: imageUploadForm,
          });

          const imageUrlJson = await imageUrl.json();

          const toolData: ToolSubmit = {
            toolCode: values.toolCode,
            name: values.name,
            maxHourUsage: values.maxHourUsage,
            image: imageUrlJson.imageUrl,
            isAvailable: values.isAvailable,
          };

          const formData = new FormData();

          formData.append("toolCode", toolData.toolCode);
          formData.append("name", toolData.name);
          formData.append("maxHourUsage", toolData.maxHourUsage.toString());
          formData.append("image", toolData.image);
          formData.append("isAvailable", toolData.isAvailable.toString());

          const response = await fetch("/api/tools/add", {
            method: "POST",
            body: formData,
          });

          const responseJson = await response.json();

          if (responseJson.error) {
            if (responseJson.error === "TOOL_CODE_EXISTS") {
              setToolCodeError("Kode alat sudah ada");
            }
          }

          setSubmitting(false);
          setOnSuccess(true);
          resetForm();
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex flex-col w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300">
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
                Kode Alat
              </label>
              <Field
                id="toolCode"
                name="toolCode"
                type="text"
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
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
                Nama Alat
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
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
            <motion.div
              key="maxHourUsage-container"
              className="flex flex-col items-start justify-start w-full gap-1"
              initial={{
                height: "70px",
              }}
              animate={{
                height: errors.maxHourUsage && touched.maxHourUsage ? "110px" : "70px",
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
                className="w-full px-5 py-2 transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50"
              />
              <AnimatePresence
                onExitComplete={() => {
                  setMaxHourUsageError(undefined);
                }}
              >
                {errors.maxHourUsage && touched.maxHourUsage && (
                  <motion.div
                    key="maxHourUsage-error"
                    className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {maxHourUsageError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              key="image-container"
              className="flex flex-col items-start justify-start w-full gap-1"
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
              <div className="w-full transition border rounded-lg outline-none border-neutral-300 ring-4 ring-transparent focus:border-celtic-800 focus:ring-celtic-800 focus:ring-opacity-50">
                <Field
                  id="image"
                  name="image"
                  type="file"
                  className="w-full p-2 outline-none file:font-sans file:font-semibold file:border-none file:rounded-full file:bg-celtic-800 file:text-white file:px-5 file:py-2 file:inline-block file:mr-3"
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
                    className="w-full px-5 py-2 text-sm text-red-500 bg-red-400 rounded-lg bg-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {imageError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <label htmlFor="isAvailable" className="flex items-center justify-start gap-2 select-none">
              <Field
                className="rounded text-celtic-500"
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
              />
              <span className="ml-2">Peralatan layak guna</span>
            </label>
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
    </>
  )
}