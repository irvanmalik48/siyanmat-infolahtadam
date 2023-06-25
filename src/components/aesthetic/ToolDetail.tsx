"use client";

import { useStaleWhileRevalidate } from "@/lib/swr";
import { Pencil, Trash, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Tool {
  id: string;
  toolCode: string;
  name: string;
  brand: string;
  maxHourUsage: number;
  image: string;
  isAvailable: boolean;
}

export default function ToolDetail({ code }: { code: string }) {
  const { data: tool, isLoading } = useStaleWhileRevalidate<Tool>(`/api/tools/${code}`);
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  function handleDelete() {
    setDeleteDialogOpen(true);
  }

  function handleCloseDialog() {
    setDeleteDialogOpen(false);
  }

  async function handleActualDelete() {
    const formData = new FormData();

    if (tool?.toolCode)
      formData.append("toolCode", tool.toolCode);

    formData.set("delete", "true");

    await fetch(`/api/tools/${code}`, {
      method: "DELETE",
    });

    setDeleteDialogOpen(false);
    router.push("/tools");
  }

  return (
    <>
      <AnimatePresence>
        {deleteDialogOpen && (
          <motion.dialog
            key="upload-profile-pic-dialog"
            className="fixed inset-0 flex items-center justify-center w-full h-full p-5 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex w-full max-w-[500px] flex-col items-center justify-center rounded-2xl bg-white p-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <h1 className="text-2xl font-semibold">Hapus Alat</h1>
              <p className="text-center">
                Apakah Anda yakin ingin menghapus alat ini?
              </p>
              <div className="flex items-center justify-center w-full gap-2 mt-5">
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2 font-semibold text-white transition bg-red-700 rounded-full w-fit hover:bg-red-600 disabled:brightness-75"
                  onClick={handleCloseDialog}
                >
                  <XCircle size={20} />
                  <span>Cancel</span>
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2 font-semibold text-white transition rounded-full bg-celtic-800 w-fit hover:bg-celtic-700 disabled:brightness-75"
                  onClick={handleActualDelete}
                >
                  <CheckCircle size={20} />
                  <span>Konfirmasi</span>
                </button>
              </div>
            </motion.div>
          </motion.dialog>
        )}
      </AnimatePresence>
      {
        !isLoading ? (
          <section className="flex flex-col w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300">
            <img src={tool?.image} className="object-contain w-full border rounded-lg lg:h-[400px] border-neutral-300 bg-neutral-500" alt={`Gambar ${code}`} />
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="toolCode">
                Kode Alat
              </label>
              <p id="toolCode" className="w-full">
                {tool?.toolCode}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="toolName">
                Nama Alat
              </label>
              <p id="toolName" className="w-full">
                {tool?.name}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="brand">
                Merek
              </label>
              <p id="brand" className="w-full">
                {tool?.brand}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="toolMaxHourUsage">
                Maksimal Jam Pemakaian
              </label>
              <p id="toolMaxHourUsage" className="w-full">
                {tool?.maxHourUsage}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="toolMaxHourUsage">
                Sisa Usia Alat
              </label>
              <p id="toolMaxHourUsage" className="w-full">
                {tool?.maxHourUsage}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="toolIsAvailable">
                Tersedia
              </label>
              <p id="toolIsAvailable" className="w-full">
                {tool?.isAvailable ? "Ya" : "Tidak"}
              </p>
            </div>
            <div className="flex items-center justify-end w-full gap-3">
              <Link
                href={`/tools/edit/${code}`}
                className="flex items-center justify-center gap-3 py-2 font-semibold text-white transition rounded-full w-fit bg-celtic-800 px-7 hover:bg-celtic-700 disabled:brightness-75"
              >
                <Pencil size={20} />
                <span>Edit</span>
              </Link>
              <button
                className="flex items-center justify-center gap-3 py-2 font-semibold text-white transition bg-red-700 rounded-full w-fit px-7 hover:bg-red-600 disabled:brightness-75"
                onClick={handleDelete}
              >
                <Trash size={20} />
                <span>Hapus</span>
              </button>
            </div>
          </section>
        ) : (
          <div className="h-[1032px] bg-neutral-200 animate-pulse w-full p-5 border mt-8 rounded-xl border-neutral-300" />
        )
      }
    </>
  )
}