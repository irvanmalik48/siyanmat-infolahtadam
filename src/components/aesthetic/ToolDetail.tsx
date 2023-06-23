"use client";

import { useStaleWhileRevalidate } from "@/lib/swr";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

interface Tool {
  id: string;
  toolCode: string;
  name: string;
  maxHourUsage: number;
  image: string;
  isAvailable: boolean;
}

export default function ToolDetail({ code }: { code: string }) {
  const { data: tool, isLoading } = useStaleWhileRevalidate<Tool>(`/api/tools/${code}`);

  return (
    <>
      <section className="flex flex-col w-full gap-5 p-5 border mt-7 rounded-xl border-neutral-300">
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
          >
            <Trash size={20} />
            <span>Hapus</span>
          </button>
        </div>
      </section>
    </>
  )
}