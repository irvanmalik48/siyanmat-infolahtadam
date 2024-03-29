"use client";

import { useStaleWhileRevalidate } from "@/lib/swr";
import { Pencil, Trash, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tool } from "@prisma/client";

interface Activity {
  id: string;
  activityCode: string;
  name: string;
  description: string;
  date: string;
  operatorName: string;
  toolUsage: number;
  tools: {
    tool: Tool;
  }[];
}

export default function ToolDetail({ code }: { code: string }) {
  const { data: activity, isLoading } = useStaleWhileRevalidate<Activity>(
    `/api/activities/${code}`
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

    if (activity?.activityCode)
      formData.append("activityCode", activity.activityCode);

    formData.set("delete", "true");

    await fetch(`/api/activities/${code}`, {
      method: "DELETE",
      body: formData,
    });

    setDeleteDialogOpen(false);
    router.push(`/activities`);
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
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="activityCode">
              Kode Kegiatan
            </label>
            <p id="toolCode" className="w-full">
              {activity?.activityCode}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="activityName">
              Nama Kegiatan
            </label>
            <p id="activityName" className="w-full">
              {activity?.name}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="description">
              Deskripsi Kegiatan
            </label>
            <p id="description" className="w-full">
              {activity?.description}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="font-semibold" htmlFor="activityDate">
              Tanggal Kegiatan
            </label>
            <p id="activityDate" className="w-full">
              {new Date(activity?.date as string).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <label className="font-semibold" htmlFor="tool">
              Alat yang Digunakan
            </label>
            {activity?.tools.length! > 0 && activity?.tools.map((tool) => (
              <Link
                id="tool"
                href={`/tools/view/${tool.tool.toolCode}`}
                className="group flex w-full flex-col gap-5 rounded-lg border border-neutral-300 p-5 transition hover:border-celtic-800 hover:bg-celtic-50 hover:bg-opacity-50 hover:ring-4 hover:ring-celtic-800 hover:ring-opacity-50"
              >
                <div className="flex w-full flex-col gap-1">
                  <label className="font-semibold" htmlFor="toolCode">
                    Kode Alat
                  </label>
                  <p id="toolCode" className="w-full">
                    {tool.tool.toolCode}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-1">
                  <label className="font-semibold" htmlFor="toolName">
                    Nama Alat
                  </label>
                  <p id="toolName" className="w-full">
                    {tool.tool.name}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-1">
                  <label className="font-semibold" htmlFor="toolBrand">
                    Merek Alat
                  </label>
                  <p id="toolBrand" className="w-full">
                    {tool.tool.brand}
                  </p>
                </div>
              </Link>
            ))}
            {activity?.tools.length! <= 0 && (
              <p className="w-full">Tidak ada alat yang digunakan.</p>
            )}
          </div>
          <div className="flex w-full items-center justify-end gap-3">
            <Link
              href={`/activities/edit/${code}`}
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
        <div className="mt-8 h-[1114px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200 p-5" />
      )}
    </>
  );
}
