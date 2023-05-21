import { Link } from "react-router-dom";
import DashLayout from "../../layouts/DashLayout";
import TableSection from "../../components/TableSection";
import { Info, Pencil, Trash2 } from "lucide-react";

export default function Index() {
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
            id="search-input"
            type="text"
            className="w-full max-w-sm px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
            placeholder="Cari..."
          />
          <select
            id="filter-by-select"
            className="w-full max-w-sm px-3 py-2 transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50"
          >
            <option value="tanggal" selected>Sortir berdasarkan tanggal kegiatan</option>
            <option value="nama">Sortir berdasarkan nama kegiatan</option>
            <option value="peralatan">Sortir berdasarkan peralatan</option>
          </select>
        </div>
        <Link to="/kegiatan/tambah" className="block w-full px-5 py-2 font-semibold text-center text-white transition rounded-lg md:w-fit min-w-fit bg-tni-dark hover:bg-tni-accented">
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
              Waktu Guna
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
          <tr className="w-full odd:bg-neutral-100">
            <td className="px-5 py-3 text-sm font-medium text-center">
              1
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              Rapat Koordinasi Acara HUT TNI ke-76
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              2021-09-01 07:00:00
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              Proyektor
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              2 jam 30 menit
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              Manto
            </td>
            <td className="px-5 py-3 text-sm font-medium text-left">
              Tidak ada keterangan.
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
