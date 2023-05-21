import { Link } from "react-router-dom";
import DashLayout from "../../layouts/DashLayout";
import TableSection from "../../components/TableSection";
import { Info, Pencil, Trash2 } from "lucide-react";

export default function Index() {
  return (
    <DashLayout
      title="Peralatan"
      description="Page untuk mengatur Peralatan"
    >
      <h1 className="text-4xl font-bold">
        Manajemen Peralatan
      </h1>
      <div className="flex flex-col justify-end gap-3 py-5 xl:justify-between xl:flex-row xl:items-center">
        <div className="flex flex-col flex-wrap w-full gap-3 lg:flex-row">
          <input
            id="search-input"
            type="text"
            className="w-full max-w-sm px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
            placeholder="Cari..."
          />
          <select
            id="filter-by-select"
            className="w-full max-w-sm px-3 py-2 transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
          >
            <option value="tanggal" selected>Sortir berdasarkan kode alat</option>
            <option value="nama">Sortir berdasarkan tanggal pengadaan</option>
            <option value="peralatan">Sortir berdasarkan sisa usia pakai</option>
          </select>
        </div>
        <Link to="/peralatan/tambah" className="block w-full px-5 py-2 font-semibold text-center text-white transition rounded-lg md:w-fit min-w-fit bg-tni-dark hover:bg-tni-accented">
          Tambah Peralatan
        </Link>
      </div>
      <TableSection>
        <thead className="text-white bg-tni-darker">
          <tr>
            <th className="w-[1%] px-5 py-3 text-sm font-bold text-center">
              No.
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Nama Alat
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Tanggal Pengadaan
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Kode Alat
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Sisa Usia Pakai
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Maksimum Usia
            </th>
            <th className="px-5 py-3 text-sm font-bold text-left">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          <tr className="w-full odd:bg-neutral-100">
            <td className="px-5 py-3 text-sm font-medium text-center">
              1
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              Proyektor
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              2020-12-03
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              K-001
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              1244 jam 30 menit
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              2000 jam
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              <div className="flex gap-3">
                <Link to="/kegiatan/info">
                  <Info size={16} />
                </Link>
                <Link to="/kegiatan/ubah">
                  <Pencil size={16} />
                </Link>
                <Link to="/kegiatan/hapus">
                  <Trash2 size={16} />
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </TableSection>
    </DashLayout>
  );
}
