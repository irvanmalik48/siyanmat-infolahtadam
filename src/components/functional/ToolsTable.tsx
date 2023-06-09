"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStaleWhileRevalidate } from "@/lib/swr";
import { atom, useAtom } from "jotai";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

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

const filterByAtom = atom<string>("all");
const processedToolsAtom = atom<Tool[] | undefined>(undefined);
const searchQueryAtom = atom<string>("");
const searchResultsAtom = atom<Tool[] | undefined>(undefined);

function getColorByCondition(condition: string) {
  switch (condition) {
    case "B":
      return "bg-green-200 text-green-700";
    case "RR":
      return "bg-yellow-200 text-yellow-700";
    case "RB":
      return "bg-red-200 text-red-700";
    default:
      return "bg-neutral-200 text-neutral-700";
  }
}

export default function ToolsTable() {
  const [page, setPage] = useState(1);
  const [start, setStart] = useState(page * 10 - 10);
  const [end, setEnd] = useState(page * 10);
  const [maxPages, setMaxPages] = useState(1);

  const [filterBy, setFilterBy] = useAtom(filterByAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  const [processedTools, setProcessedTools] = useAtom(processedToolsAtom);
  const [searchResults, setSearchResults] = useAtom(searchResultsAtom);

  const {
    data: tools,
    isLoading,
    isValidating,
  } = useStaleWhileRevalidate<Tool[]>("/api/tools/get?all");

  useEffect(() => {
    if ((!isLoading || !isValidating) && tools) {
      setProcessedTools(
        tools.sort((a, b) => a.toolCode.localeCompare(b.toolCode))
      );
      setMaxPages(Math.ceil(tools?.length / 10));
    }
  }, [isLoading, isValidating]);

  useEffect(() => {
    if (!isLoading && tools && filterBy === "all") {
      setMaxPages(Math.ceil(tools?.length / 10));
      setProcessedTools(tools);
    }

    if (!isLoading && tools && filterBy === "baik") {
      setMaxPages(
        Math.ceil(
          tools?.filter((tool) => tool.condition.startsWith("B")).length / 10
        )
      );
      setProcessedTools(
        tools?.filter((tool) => tool.condition.startsWith("B"))
      );
    }

    if (!isLoading && tools && filterBy === "rusak-ringan") {
      setMaxPages(
        Math.ceil(
          tools?.filter((tool) => tool.condition.includes("RR")).length / 10
        )
      );
      setProcessedTools(tools?.filter((tool) => tool.condition.includes("RR")));
    }

    if (!isLoading && tools && filterBy === "rusak-berat") {
      setMaxPages(
        Math.ceil(
          tools?.filter((tool) => tool.condition.includes("RB")).length / 10
        )
      );
      setProcessedTools(tools?.filter((tool) => tool.condition.includes("RB")));
    }
  }, [filterBy]);

  useEffect(() => {
    const fuse = new Fuse(tools as Tool[], {
      keys: ["toolCode", "name", "brand", "maxHourUsage", "hourUsageLeft"],
      threshold: 0.3,
    });

    if (!isLoading && tools && searchQuery !== "") {
      setSearchResults(fuse.search(searchQuery).map((result) => result.item));
      const maxPageNumberAfterSearch = Math.ceil(
        (searchResults?.length as number) / 10
      );

      setMaxPages(
        isNaN(maxPageNumberAfterSearch) || maxPageNumberAfterSearch <= 1
          ? 1
          : maxPageNumberAfterSearch
      );
    } else {
      setSearchResults(undefined);
      setMaxPages(Math.ceil((tools?.length as number) / 10));
    }
  }, [searchQuery]);

  return (
    <div className="mt-8 flex w-full flex-col gap-5">
      <div className="flex w-full items-end justify-between gap-5">
        <div className="flex w-fit items-center gap-3">
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
              className="w-72 appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition focus:border-celtic-800 focus:outline-none focus:ring-4 focus:ring-celtic-800 focus:ring-opacity-50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="filter" className="font-semibold">
              Filter berdasarkan:
            </label>
            <select
              name="filter"
              id="filter"
              className="w-48 appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition focus:border-celtic-800 focus:outline-none focus:ring-4 focus:ring-celtic-800 focus:ring-opacity-50"
              defaultValue={"all"}
              onChange={(e) => {
                setFilterBy(e.target.value);
              }}
            >
              <option value="all">Semua</option>
              <option value="baik">Kondisi baik</option>
              <option value="rusak-ringan">Rusak ringan</option>
              <option value="rusak-berat">Rusak berat</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-5">
          <AnimatePresence>
            {!isValidating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-neutral-500"
              >
                <RefreshCw
                  size={16}
                  className="animate-spin text-neutral-500"
                />
                <span className="font-semibold">Autorefreshing...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Link
            href="/tools/add"
            className="w-fit rounded-full bg-celtic-800 px-7 py-2 font-semibold text-white transition hover:bg-celtic-700 disabled:brightness-75"
          >
            Tambah
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="h-[537px] w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-200" />
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-neutral-300">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto lg:table-fixed">
              <thead className="bg-celtic-800">
                <tr className="text-sm font-semibold text-white">
                  <th className="w-[5%] px-5 py-3 text-center">No.</th>
                  <th className="w-1/12 px-5 py-3 text-left">Kode Alat</th>
                  <th className="px-5 py-3 text-left">Nama Alat</th>
                  <th className="w-[16%] px-5 py-3 text-center">Merek</th>
                  <th className="w-[12%] px-5 py-3 text-center">
                    Sisa Masa Pakai
                  </th>
                  <th className="w-[12%] px-5 py-3 text-center">
                    Maks. Masa Pakai
                  </th>
                  <th className="w-1/12 px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {typeof searchResults === "undefined" &&
                  processedTools
                    ?.slice(start, end)
                    .map((tool, index) => (
                      <ToolTableRow
                        key={tool.id}
                        index={index + start}
                        tool={tool}
                      />
                    ))}
                {typeof searchResults !== "undefined" &&
                  searchResults
                    ?.slice(start, end)
                    .map((tool, index) => (
                      <ToolTableRow
                        key={tool.id}
                        index={index + start}
                        tool={tool}
                      />
                    ))}
                {typeof searchResults === "undefined" &&
                  processedTools &&
                  processedTools?.slice(start, end).length < 10 &&
                  Array(10 - processedTools.slice(start, end).length)
                    .fill("")
                    .map((_, index) => <EmptyToolTableRow key={index} />)}
                {typeof searchResults !== "undefined" &&
                  searchResults &&
                  searchResults?.slice(start, end).length < 10 &&
                  Array(10 - searchResults.slice(start, end).length)
                    .fill("")
                    .map((_, index) => <EmptyToolTableRow key={index} />)}
              </tbody>
            </table>
          </div>
          <div className="flex w-full items-center justify-center bg-celtic-800 px-5 py-2">
            <div className="flex w-full max-w-[20rem] items-center justify-between">
              <button
                disabled={page === 1 || maxPages === 1}
                className="rounded-full bg-celtic-700 px-3 py-1 text-sm font-semibold text-white transition hover:bg-celtic-600 disabled:brightness-75"
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
                className="rounded-full bg-celtic-700 px-3 py-1 text-sm font-semibold text-white transition hover:bg-celtic-600 disabled:brightness-75"
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
      )}
    </div>
  );
}

function ToolTableRow({ tool, index }: { tool: Tool; index: number }) {
  return (
    <tr className="text-sm text-neutral-700">
      <td className="px-5 py-3 text-center">{index + 1}</td>
      <td className="px-5 py-3">
        <Link
          href={`/tools/view/${tool.toolCode}`}
          className="font-semibold text-celtic-800 hover:text-celtic-700"
        >
          {tool.toolCode}
        </Link>
      </td>
      <td className="px-5 py-3">{tool.name}</td>
      <td className="px-5 py-3 text-center">{tool.brand}</td>
      <td className="px-5 py-3 text-center">{tool.hourUsageLeft}</td>
      <td className="px-5 py-3 text-center">{tool.maxHourUsage}</td>
      <td className="px-5 py-3 text-center">
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${getColorByCondition(
            tool.condition
          )}`}
        >
          {tool.condition}
        </span>
      </td>
    </tr>
  );
}

function EmptyToolTableRow() {
  return (
    <tr className="bg-neutral-100 text-sm text-neutral-100">
      <td className="px-5 py-3 text-center">-</td>
      <td className="px-5 py-3">-</td>
      <td className="px-5 py-3">-</td>
      <td className="px-5 py-3 text-center">-</td>
      <td className="px-5 py-3 text-center">-</td>
      <td className="px-5 py-3 text-center">-</td>
      <td className="px-5 py-3 text-center">-</td>
    </tr>
  );
}
