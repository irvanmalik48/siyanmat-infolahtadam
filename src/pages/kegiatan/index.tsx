import Link from "next/link";
import DashLayout from "@/components/DashLayout";
import TableSection from "@/components/TableSection";
import { Info, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/common/trpc";

export default function Index() {
  const [listKegiatan, setListKegiatan] = useState<any[]>([]);
  const [listPeralatan, setListPeralatan] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"tanggal" | "nama" | "operator">("tanggal");
  const [search, setSearch] = useState<string>("");
  const [fetched, setFetched] = useState<boolean>(false);
  const [hasFetchError, setHasFetchError] = useState<boolean>(false);

  const getAllKegiatan = trpc.getAllKegiatan.useMutation();
  const getAllPeralatan = trpc.getAllPeralatan.useMutation();

  function parseToJamMenit(variable: number) {
    const jam = Math.floor(variable / 60);
    const menit = variable % 60;

    if (jam === 0) {
      return `${menit} menit`;
    }

    if (menit === 0) {
      return `${jam} jam`;
    }

    return `${jam} jam ${menit} menit`;
  }

  useEffect(() => {
    async function getData() {
      const resOne = await getAllKegiatan.mutateAsync();
      const resTwo = await getAllPeralatan.mutateAsync();
      if (resOne.status === 201 && resTwo.status === 201) {
        setFetched(true);
        setListPeralatan(resTwo.result);
        setListKegiatan(resOne.result.sort((a: any, b: any) => {
          if (sortBy === "tanggal")
            return new Date(b.tglKegiatan).getTime() - new Date(a.tglKegiatan).getTime();
          if (sortBy === "nama")
            return a.namaKegiatan.localeCompare(b.namaKegiatan);
          if (sortBy === "operator")
            return a.operator.localeCompare(b.operator);
        }));
        if (search !== "") {
          setListKegiatan(resOne.result.filter((obj: any) => {
            return obj.namaKegiatan.toLowerCase().includes(search.toLowerCase()) ||
              obj.operator.toLowerCase().includes(search.toLowerCase()) ||
              obj.keterangan.toLowerCase().includes(search.toLowerCase()) ||
              obj.tglKegiatan.toLowerCase().includes(search.toLowerCase());
          }));
        }
      } else {
        setHasFetchError(true);
      }
    }

    getData();
  }, [sortBy, search])

  function AllKegiatan() {
    return (
      <>
        {fetched === false && (
          <tr className="w-full">
            <td className="px-5 py-3 text-sm font-medium text-center" colSpan={8} rowSpan={10}>
              Mengambil data...
            </td>
          </tr>
        )}
        {hasFetchError === true && (
          <tr className="w-full">
            <td className="px-5 py-3 text-sm font-medium text-center" colSpan={8} rowSpan={10}>
              Terjadi kesalahan saat mengambil data.
            </td>
          </tr>
        )}
        {listKegiatan.length > 0 && listKegiatan.map((obj, key) => (
          <tr key={key} className="w-full odd:bg-neutral-100">
            <td className="px-5 py-3 text-sm font-medium text-center">
              {key + 1}
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              {obj.namaKegiatan}
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              {(new Date(obj.tglKegiatan)).toLocaleDateString("id-ID")}
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              {
                listPeralatan.filter((peralatan) => peralatan.id === obj.idPeralatan)[0].namaPeralatan
              }
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              {parseToJamMenit(obj.waktuGuna)}
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              {obj.operator}
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              {obj.keterangan}
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              <div className="flex gap-3">
                <Link href={`/kegiatan/info/${obj.id}`}>
                  <Info size={16} />
                </Link>
                <Link href={`/kegiatan/edit/${obj.id}`}>
                  <Pencil size={16} />
                </Link>
                <Link href={`/kegiatan/delete/${obj.id}`}>
                  <Trash2 size={16} />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <DashLayout
      title="Kegiatan"
      description="Page untuk mengatur kegiatan"
    >
      <h1 className="text-4xl font-bold">
        Manajemen Kegiatan
      </h1>
      <div className="flex flex-col justify-end gap-3 py-5 xl:justify-between xl:flex-row xl:items-center">
        <div className="flex flex-col flex-wrap w-full gap-3 lg:flex-row">
          <input
            onChange={(e) => setSearch(e.target.value)}
            id="search-input"
            type="text"
            className="w-full max-w-sm px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
            placeholder="Cari..."
          />
          <select
            id="filter-by-select"
            className="w-full max-w-sm px-3 py-2 transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
            defaultValue={"tanggal"}
            onChange={(e) => setSortBy(e.target.value as "tanggal" | "nama" | "operator")}
          >
            <option value="tanggal">Sortir berdasarkan tanggal kegiatan</option>
            <option value="nama">Sortir berdasarkan nama kegiatan</option>
            <option value="operator">Sortir berdasarkan operator</option>
          </select>
        </div>
        <Link href="/kegiatan/tambah" className="block w-full px-5 py-2 font-semibold text-center text-white transition rounded-lg md:w-fit min-w-fit bg-tni-dark hover:bg-tni-accented">
          Tambah Kegiatan
        </Link>
      </div>
      <TableSection>
        <thead className="text-white bg-tni-darker">
          <tr>
            <th className="w-[1%] px-5 py-3 text-sm font-bold text-center">
              No.
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Nama Kegiatan
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Tanggal Pelaksanaan
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Peralatan
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Waktu Penggunaan
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Operator
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Keterangan
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          <AllKegiatan />
        </tbody>
      </TableSection>
    </DashLayout>
  );
}
