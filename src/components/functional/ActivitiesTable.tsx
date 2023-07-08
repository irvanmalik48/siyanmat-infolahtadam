"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStaleWhileRevalidate } from "@/lib/swr";
import { atom, useAtom } from "jotai";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Tool } from "@prisma/client";

interface Activity {
  id: string;
  activityCode: string;
  name: string;
  description: string;
  date: string;
  operatorName: string;
  toolCode: string;
  toolUsage: number;
  tools: {
    activityId: string;
    toolId: string;
    tool: Tool;
  }[];
}

const sortByAtom = atom<string>("date");
const processedActivitiesAtom = atom<Activity[] | undefined>(undefined);
const searchQueryAtom = atom<string>("");
const searchResultsAtom = atom<Activity[] | undefined>(undefined);

export default function ActivitiesTable() {
  const [page, setPage] = useState(1);
  const [start, setStart] = useState(page * 10 - 10);
  const [end, setEnd] = useState(page * 10);
  const [maxPages, setMaxPages] = useState(1);

  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  const [processedActivities, setProcessedActivities] = useAtom(
    processedActivitiesAtom
  );
  const [searchResults, setSearchResults] = useAtom(searchResultsAtom);

  const {
    data: activities,
    isLoading,
    isValidating,
  } = useStaleWhileRevalidate<Activity[]>("/api/activities/get");

  useEffect(() => {
    if ((!isLoading || !isValidating) && activities) {
      setProcessedActivities(
        activities.sort((a, b) => a.toolCode.localeCompare(b.toolCode))
      );
      setMaxPages(Math.ceil(activities?.length / 10));
    }
  }, [isLoading, isValidating]);

  useEffect(() => {
    if (!isLoading && activities && sortBy === "date") {
      setMaxPages(Math.ceil(activities?.length / 10));
      setProcessedActivities(activities);
    }

    if (!isLoading && activities && sortBy === "name") {
      setProcessedActivities(
        activities?.sort((a, b) => a.name.localeCompare(b.name))
      );
    }

    if (!isLoading && activities && sortBy === "activityCode") {
      setProcessedActivities(
        activities?.sort((a, b) => a.activityCode.localeCompare(b.activityCode))
      );
    }

    if (!isLoading && activities && sortBy === "operatorName") {
      setProcessedActivities(
        activities?.sort((a, b) => a.operatorName.localeCompare(b.operatorName))
      );
    }
  }, [sortBy]);

  useEffect(() => {
    const fuse = new Fuse(activities as Activity[], {
      keys: ["name", "activityCode", "date", "operatorName"],
      threshold: 0.3,
    });

    if (!isLoading && activities && searchQuery !== "") {
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
      setMaxPages(Math.ceil((activities?.length as number) / 10));
    }
  }, [searchQuery]);

  return (
    <div className="mt-8 flex w-full flex-col gap-5">
      <div className="flex w-full items-end justify-between gap-5">
        <div className="flex w-fit items-center gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="search" className="font-semibold">
              Pencarian Kegiatan
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
              Sortir berdasarkan:
            </label>
            <select
              name="sort"
              id="sort"
              className="w-48 appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition focus:border-celtic-800 focus:outline-none focus:ring-4 focus:ring-celtic-800 focus:ring-opacity-50"
              defaultValue={"date"}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
            >
              <option value="date">Tanggal</option>
              <option value="name">Nama Kegiatan</option>
              <option value="activityCode">Kode Kegiatan</option>
              <option value="toolCode">Kode Alat</option>
              <option value="operatorName">Nama Operator</option>
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
            href="/activities/add"
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
                  <th className="w-1/12 px-5 py-3 text-left">Kode Giat</th>
                  <th className="px-5 py-3 text-left">Nama Giat</th>
                  <th className="w-[16%] px-5 py-3 text-center">Tanggal</th>
                  <th className="w-[16%] px-5 py-3 text-center">
                    Nama Operator
                  </th>
                  <th className="px-5 py-3 text-left">Nama Alat</th>
                  <th className="w-[12%] px-5 py-3 text-center">
                    Waktu Guna (jam)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {typeof searchResults === "undefined" &&
                  processedActivities
                    ?.slice(start, end)
                    .map((activity, index) => (
                      <ActivityTableRow
                        key={activity.id}
                        index={index + start}
                        activity={activity}
                      />
                    ))}
                {typeof searchResults !== "undefined" &&
                  searchResults
                    ?.slice(start, end)
                    .map((activity, index) => (
                      <ActivityTableRow
                        key={activity.id}
                        index={index + start}
                        activity={activity}
                      />
                    ))}
                {typeof searchResults === "undefined" &&
                  processedActivities &&
                  processedActivities?.slice(start, end).length < 10 &&
                  Array(10 - processedActivities.slice(start, end).length)
                    .fill("")
                    .map((_, index) => <EmptyActivityTableRow key={index} />)}
                {typeof searchResults !== "undefined" &&
                  searchResults &&
                  searchResults?.slice(start, end).length < 10 &&
                  Array(10 - searchResults.slice(start, end).length)
                    .fill("")
                    .map((_, index) => <EmptyActivityTableRow key={index} />)}
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

function ActivityTableRow({
  activity: activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  return (
    <tr className="text-sm text-neutral-700">
      <td className="px-5 py-3 text-center">{index + 1}</td>
      <td className="px-5 py-3">
        <Link
          href={`/activities/view/${activity.activityCode}`}
          className="font-semibold text-celtic-800 hover:text-celtic-700"
        >
          {activity.activityCode}
        </Link>
      </td>
      <td className="px-5 py-3">{activity.name}</td>
      <td className="px-5 py-3 text-center">
        {new Date(activity.date).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>
      <td className="px-5 py-3 text-center">{activity.operatorName}</td>
      <td className="overflow-x-hidden truncate px-5 py-3">
        {activity.tools.map((tool, index) => (
          <span key={tool.tool.id}>
            {tool.tool.name}
            {index !== activity.tools.length - 1 && ", "}
          </span>
        ))}
      </td>
      <td className="px-5 py-3 text-center">{activity.toolUsage}</td>
    </tr>
  );
}

function EmptyActivityTableRow() {
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
