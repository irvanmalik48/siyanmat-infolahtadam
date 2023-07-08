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
  }[]
}

export default function ToolDetail({ code }: { code: string }) {
  const { data: activity, isLoading } = useStaleWhileRevalidate<Activity>(`/api/activities/${code}`);
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
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="activityCode">
                Kode Kegiatan
              </label>
              <p id="toolCode" className="w-full">
                {activity?.activityCode}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="activityName">
                Nama Kegiatan
              </label>
              <p id="activityName" className="w-full">
                {activity?.name}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label className="font-semibold" htmlFor="description">
                Deskripsi Kegiatan
              </label>
              <p id="description" className="w-full">
                {activity?.description}
              </p>
            </div>
            <div className="flex flex-col w-full gap-1">
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
            <div className="flex flex-col w-full gap-3">
              <label className="font-semibold" htmlFor="tool">
                Alat yang Digunakan
              </label>
              {
                activity?.tools.map((tool) => (
                  <Link
                    id="tool"
                    href={`/tools/view/${tool.tool.toolCode}`}
                    className="flex flex-col w-full gap-5 p-5 transition border rounded-lg border-neutral-300 hover:bg-celtic-50 hover:bg-opacity-50 group hover:border-celtic-800 hover:ring-4 hover:ring-celtic-800 hover:ring-opacity-50"
                  >
                    <div className="flex flex-col w-full gap-1">
                      <label className="font-semibold" htmlFor="toolCode">Kode Alat</label>
                      <p id="toolCode" className="w-full">
                        {tool.tool.toolCode}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label className="font-semibold" htmlFor="toolName">Nama Alat</label>
                      <p id="toolName" className="w-full">
                        {tool.tool.name}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label className="font-semibold" htmlFor="toolBrand">Merek Alat</label>
                      <p id="toolBrand" className="w-full">
                        {tool.tool.brand}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label className="font-semibold" htmlFor="toolUsage">Nominal Waktu Penggunaan (jam)</label>
                      <p id="toolUsage" className="w-full">
                        {tool.tool.hourUsageLeft}
                      </p>
                    </div>
                  </Link>
                ))
              }
            </div>
            <div className="flex items-center justify-end w-full gap-3">
              <Link
                href={`/activities/edit/${code}`}
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
          <div className="h-[1114px] bg-neutral-200 animate-pulse w-full p-5 border mt-8 rounded-xl border-neutral-300" />
        )
      }
    </>
  )
}