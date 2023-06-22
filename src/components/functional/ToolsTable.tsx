"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStaleWhileRevalidate } from "@/lib/swr";
import { atom, useAtom } from "jotai";
import Fuse from "fuse.js";

interface Tool {
  id: string;
  toolCode: string;
  name: string;
  maxHourUsage: number;
  image: string;
  isAvailable: boolean;
}

const filterByAtom = atom<string>("all");
const processedToolsAtom = atom<Tool[] | undefined>(undefined);
const searchQueryAtom = atom<string>("");
const searchResultsAtom = atom<Tool[] | undefined>(undefined);

export default function ToolsTable() {
  const [page, setPage] = useState(1);
  const [start, setStart] = useState(page * 10 - 10);
  const [end, setEnd] = useState(page * 10);
  const [maxPages, setMaxPages] = useState(1);

  const [filterBy, setFilterBy] = useAtom(filterByAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  const [processedTools, setProcessedTools] = useAtom(processedToolsAtom);
  const [searchResults, setSearchResults] = useAtom(searchResultsAtom);

  const { data: tools, isLoading } = useStaleWhileRevalidate<Tool[]>("/api/tools/get?all");

  useEffect(() => {
    if (!isLoading && tools) {
      setProcessedTools(tools.sort((a, b) => a.toolCode.localeCompare(b.toolCode)));
      setMaxPages(Math.ceil(tools?.length / 10));
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && tools && filterBy === "all") {
      setMaxPages(Math.ceil(tools?.length / 10));
      setProcessedTools(tools);
    }

    if (!isLoading && tools && filterBy === "available") {
      setMaxPages(Math.ceil(tools?.filter((tool) => tool.isAvailable).length / 10));
      setProcessedTools(tools?.filter((tool) => tool.isAvailable));
    }

    if (!isLoading && tools && filterBy === "unavailable") {
      setMaxPages(Math.ceil(tools?.filter((tool) => !tool.isAvailable).length / 10));
      setProcessedTools(tools?.filter((tool) => !tool.isAvailable));
    }
  }, [filterBy]);

  useEffect(() => {
    const fuse = new Fuse(tools as Tool[], {
      keys: ["toolCode", "name"],
      threshold: 0.3,
    });

    if (!isLoading && tools && searchQuery !== "") {
      setSearchResults(fuse.search(searchQuery).map((result) => result.item));
      const maxPageNumberAfterSearch = Math.ceil(searchResults?.length as number / 10);

      setMaxPages(isNaN(maxPageNumberAfterSearch) || maxPageNumberAfterSearch <= 1 ? 1 : maxPageNumberAfterSearch);
    } else {
      setSearchResults(undefined);
      setMaxPages(Math.ceil(tools?.length as number / 10));
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col w-full gap-5 mt-8">
      <div className="flex items-end justify-between w-full gap-5">
        <div className="flex items-center gap-3 w-fit">
          <div className="flex flex-col gap-1">
            <label htmlFor="search" className="font-semibold">
              Pencarian Alat
            </label>
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Cari..."
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="px-3 py-2 text-sm transition bg-white border rounded-lg appearance-none w-72 border-neutral-300 focus:outline-none focus:ring-4 focus:ring-celtic-800 focus:ring-opacity-50 focus:border-celtic-800"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="filter" className="font-semibold">
              Filter berdasarkan:
            </label>
            <select
              name="filter"
              id="filter"
              className="w-48 px-3 py-2 text-sm transition bg-white border rounded-lg appearance-none border-neutral-300 focus:outline-none focus:ring-4 focus:ring-celtic-800 focus:ring-opacity-50 focus:border-celtic-800"
              defaultValue={"all"}
              onChange={(e) => {
                setFilterBy(e.target.value);
              }}
            >
              <option value="all">Semua</option>
              <option value="available">Tersedia</option>
              <option value="unavailable">Tidak Tersedia</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/tools/add"
            className="py-2 font-semibold text-white transition rounded-full w-fit bg-celtic-800 px-7 hover:bg-celtic-700 disabled:brightness-75"
          >
            Tambah
          </Link>
        </div>
      </div>
      {
        isLoading ? (
          <div className="w-full h-[537px] rounded-xl border border-neutral-300 bg-neutral-200 animate-pulse" />
        ) : (
          <div className="w-full overflow-hidden border rounded-xl border-neutral-300">
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto lg:table-fixed">
                <thead className="bg-celtic-800">
                  <tr className="text-sm font-semibold text-white">
                    <th className="px-5 py-3 w-[5%] text-center">
                      No.
                    </th>
                    <th className="w-1/12 px-5 py-3 text-left">Kode Alat</th>
                    <th className="px-5 py-3 text-left">Nama Alat</th>
                    <th className="px-5 py-3 text-center w-[12%]">Sisa Masa Pakai</th>
                    <th className="px-5 py-3 text-center w-[12%]">Maks. Masa Pakai</th>
                    <th className="w-1/12 px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {
                    typeof searchResults === "undefined" && processedTools?.slice(start, end).map((tool, index) => (
                      <ToolTableRow
                        key={tool.id}
                        index={index + start}
                        tool={tool}
                      />
                    ))
                  }
                  {
                    typeof searchResults !== "undefined" && searchResults?.slice(start, end).map((tool, index) => (
                      <ToolTableRow
                        key={tool.id}
                        index={index + start}
                        tool={tool}
                      />
                    ))
                  }
                  {
                    typeof searchResults === "undefined" && processedTools && processedTools?.slice(start, end).length < 10 && (
                      Array(10 - processedTools.slice(start, end).length).fill("").map((_, index) => (
                        <EmptyToolTableRow key={index} />
                      ))
                    )
                  }
                  {
                    typeof searchResults !== "undefined" && searchResults && searchResults?.slice(start, end).length < 10 && (
                      Array(10 - searchResults.slice(start, end).length).fill("").map((_, index) => (
                        <EmptyToolTableRow key={index} />
                      ))
                    )
                  }
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center w-full px-5 py-2 bg-celtic-800">
              <div className="flex items-center justify-between w-full max-w-[20rem]">
                <button
                  disabled={page === 1 || maxPages === 1}
                  className="px-3 py-1 text-sm font-semibold text-white transition rounded-full bg-celtic-700 hover:bg-celtic-600 disabled:brightness-75"
                  onClick={() => {
                    setPage(page - 1);
                    setStart(start - 10);
                    setEnd(end - 10);
                  }}
                >
                  Sebelumnya
                </button>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span>{page}</span>
                  <span>/</span>
                  <span>{maxPages}</span>
                </div>
                <button
                  disabled={page === maxPages || maxPages === 1}
                  className="px-3 py-1 text-sm font-semibold text-white transition rounded-full bg-celtic-700 hover:bg-celtic-600 disabled:brightness-75"
                  onClick={() => {
                    setPage(page + 1);
                    setStart(start + 10);
                    setEnd(end + 10);
                  }}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

function ToolTableRow({ tool, index }: { tool: Tool, index: number }) {
  return (
    <tr className="text-sm text-neutral-700">
      <td className="px-5 py-3 text-center">
        {index + 1}
      </td>
      <td className="px-5 py-3">
        <Link
          href={`/tools/${tool.toolCode}`}
          className="font-semibold text-celtic-800 hover:text-celtic-700"
        >
          {tool.toolCode}
        </Link>
      </td>
      <td className="px-5 py-3">
        {tool.name}
      </td>
      <td className="px-5 py-3 text-center">
        {tool.maxHourUsage}
      </td>
      <td className="px-5 py-3 text-center">
        {tool.maxHourUsage}
      </td>
      <td className="px-5 py-3 text-center">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tool.isAvailable ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
          {tool.isAvailable ? "Available" : "Unavailable"}
        </span>
      </td>
    </tr>
  )
}

function EmptyToolTableRow() {
  return (
    <tr className="text-sm text-neutral-100 bg-neutral-100">
      <td className="px-5 py-3 text-center">
        -
      </td>
      <td className="px-5 py-3">
        -
      </td>
      <td className="px-5 py-3">
        -
      </td>
      <td className="px-5 py-3 text-center">
        -
      </td>
      <td className="px-5 py-3 text-center">
        -
      </td>
      <td className="px-5 py-3 text-center">
        -
      </td>
    </tr>
  )
}