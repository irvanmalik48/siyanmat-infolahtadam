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
  hourUsageLeft: number;
  image: string;
  condition: string;
}

function getProperLabelByCondition(condition: string) {
  switch (condition) {
    case "B":
      return "B (Baik)";
    case "RR":
      return "RR (Rusak Ringan)";
    case "RB":
      return "RB (Rusak Berat)";
    default:
      return "N/A";
  }
}

export default function ToolDetail({ code }: { code: string }) {
  const { data: tool, isLoading } = useStaleWhileRevalidate<Tool>(
    `/api/tools/${code}`
  );
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

    if (tool?.toolCode) formData.append("toolCode", tool.toolCode);

    formData.set("delete", "true");

    await fetch(`/api/tools/${code}`, {
      method: "DELETE",
      body: formData,
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
            className="fixed inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-5"
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
              <div className="mt-5 flex w-full items-center justify-center gap-2">
                <button
                  className="flex w-fit items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-2 font-semibold text-white transition hover:bg-red-600 disabled:brightness-75"
                  onClick={handleCloseDialog}
                >
                  <XCircle size={20} />
                  <span>Cancel</span>
                </button>
                <button
                  className="flex w-fit items-center justify-center gap-2 rounded-full bg-celtic-800 px-5 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-75"
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
      {!isLoading ? (
        <section className="mt-8 flex w-full flex-col gap-5 rounded-xl border border-neutral-300 p-5">
          <img
            src={`/api/images${tool?.image}`}
            className="w-full rounded-lg border border-neutral-300 bg-neutral-500 object-contain lg:h-[400px]"
            alt={`Gambar ${code}`}
          />
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="toolCode">
              Kode Alat
            </label>
            <p id="toolCode" className="w-full">
              {tool?.toolCode}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="toolName">
              Nama Alat
            </label>
            <p id="toolName" className="w-full">
              {tool?.name}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="brand">
              Merek
            </label>
            <p id="brand" className="w-full">
              {tool?.brand}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="toolMaxHourUsage">
              Maksimal Jam Pemakaian
            </label>
            <p id="toolMaxHourUsage" className="w-full">
              {tool?.maxHourUsage}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="hourUsageLeft">
              Sisa Usia Alat
            </label>
            <p id="hourUsageLeft" className="w-full">
              {tool?.hourUsageLeft} jam dari {tool?.maxHourUsage} jam
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="toolCondition">
              Kondisi Alat
            </label>
            <p id="toolCondition" className="w-full">
              {getProperLabelByCondition(tool?.condition as string)}
            </p>
          </div>
          <div className="flex w-full items-center justify-end gap-3">
            <Link
              href={`/tools/edit/${code}`}
              className="flex w-fit items-center justify-center gap-3 rounded-full bg-celtic-800 px-7 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-75"
            >
              <Pencil size={20} />
              <span>Edit</span>
            </Link>
            <button
              className="flex w-fit items-center justify-center gap-3 rounded-full bg-red-700 px-7 py-2 font-semibold text-white transition hover:bg-red-600 disabled:brightness-75"
              onClick={handleDelete}
            >
              <Trash size={20} />
              <span>Hapus</span>
            </button>
          </div>
        </section>
      ) : (
        <div className="mt-8 h-[1032px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200 p-5" />
      )}
    </>
  );
}
