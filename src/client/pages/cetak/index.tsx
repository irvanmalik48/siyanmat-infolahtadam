import { useForm } from "react-hook-form";
import DashLayout from "../../layouts/DashLayout";
import ReactDatePicker from "react-datepicker";
import { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

export default function Index() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleFormSubmit = (e: any) => {
    console.log("submitted");
  }

  return (
    <DashLayout
      title="Cetak"
      description="Page untuk mencetak laporan"
    >
      <h1 className="text-4xl font-bold">
        Manajemen Laporan
      </h1>
      <form className="max-w-4xl p-5 my-5 text-white rounded-xl bg-tni-dark" onSubmit={handleSubmit(handleFormSubmit)}>
        <h2 className="w-full text-xl font-bold text-center">
          Silahkan isi form berikut untuk mencetak laporan
        </h2>
        <div className="flex flex-col gap-3 mt-5 md:flex-row">
          <div className="flex flex-col w-full gap-1">
            <label className="font-semibold" htmlFor="namaLaporan">
              Nama Laporan
              <span className="text-red-400">*</span>
            </label>
            <input
              id="namaLaporan"
              type="text"
              className="w-full px-3 py-2 text-black transition border-2 border-gray-300 rounded-lg outline-none focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50"
              placeholder="Masukkan nama laporan"
              {...register("namaLaporan", { required: true })}
            />
            {errors.namaLaporan?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Nama laporan tidak boleh kosong</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="jenisLaporan">
              Jenis Laporan
              <span className="text-red-400">*</span>
            </label>
            <select
              defaultValue="default"
              id="jenisLaporan"
              className="max-w-sm min-w-[12rem] px-3 py-2 pr-10 text-black transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none select-add-icon focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50"
              {...register("jenisLaporan", {
                required: true,
                validate: (value) => value !== "default"
              })}
            >
              <option value="default">Silahkan pilih...</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="peralatan">Peralatan</option>
            </select>
            {errors.jenisLaporan?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Jenis laporan tidak boleh kosong</p>}
          </div>
        </div>
        <div className="flex flex-col w-full gap-3 mt-5 md:flex-row">
          <div className="flex flex-col w-full gap-1">
            <p className="font-semibold">
              Tanggal Efektif
              <span className="text-red-400">*</span>
            </p>
            <div className="flex flex-col items-start w-full gap-2 md:items-center md:flex-row">
              <ReactDatePicker
                selected={startDate}
                {...register("startDate", { required: true })}
                onChange={(date: any) => setStartDate(date)}
                className="max-w-full md:max-w-[12rem] px-3 py-2 text-black transition border-2 border-gray-300 rounded-lg outline-none focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50 date-add-icon"
                withPortal
                dateFormat={"dd/MM/yyyy"}
              />
              <p className="w-fit">
                s/d
              </p>
              <ReactDatePicker
                selected={endDate}
                {...register("endDate", { required: true })}
                onChange={(date: any) => setEndDate(date)}
                className="max-w-full md:max-w-[12rem] px-3 py-2 text-black transition border-2 border-gray-300 rounded-lg outline-none focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50 date-add-icon"
                withPortal
                dateFormat={"dd/MM/yyyy"}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="useFilter">
              Gunakan Filter
              <span className="text-red-400">*</span>
            </label>
            <select
              defaultValue="no"
              id="useFilter"
              className="max-w-sm min-w-[12rem] px-3 py-2 pr-10 text-black transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none select-add-icon focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50"
              {...register("useFilter", { required: true })}
            >
              <option value="no">Tidak</option>
              <option value="yes">Ya</option>
            </select>
            {errors.useFilter?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Kolom ini harus ditentukan</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="sortBy">
              Urutkan berdasarkan
              <span className="text-red-400">*</span>
            </label>
            <select
              defaultValue="default"
              id="sortBy"
              className="max-w-sm min-w-[12rem] px-3 py-2 pr-10 text-black transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none select-add-icon focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50"
              {...register("sortBy", { required: true })}
            >
              <option value="default">Silahkan pilih...</option>
              {watch("jenisLaporan") === "peralatan" && <option value="tanggalPengadaan">Tgl. Pengadaan</option>}
              {watch("jenisLaporan") === "peralatan" && <option value="namaPeralatan">Nama Alat</option>}
              {watch("jenisLaporan") === "kegiatan" && <option value="tanggalPelaksanaan">Tgl. Pelaksanaan</option>}
              {watch("jenisLaporan") === "kegiatan" && <option value="peralatan">Peralatan</option>}
              {watch("jenisLaporan") === "kegiatan" && <option value="operator">Operator</option>}
            </select>
            {errors.sortBy?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Kolom ini harus ditentukan</p>}
          </div>
        </div>
        {
          watch("useFilter") === "yes" && (
            <div className="grid w-full grid-cols-1 gap-3 p-3 mt-5 rounded-lg md:grid-cols-2 bg-tni-darker md:flex-row">
              <h2 className="px-5 py-1 mx-auto text-lg font-bold rounded-full md:col-span-2 w-fit bg-tni-accented">
                Pengaturan Filter
              </h2>
              <div className="flex flex-col w-full gap-1">
                <label className="font-semibold" htmlFor="filterBy">
                  Filter berdasarkan
                  <span className="text-red-400">*</span>
                </label>
                <select
                  defaultValue="default"
                  id="filterBy"
                  className="w-full min-w-[12rem] px-3 py-2 pr-10 text-black transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none select-add-icon focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50"
                  {...register("filterBy", { required: true })}
                >
                  <option value="default">Silahkan pilih...</option>
                  <option value="operator">Nama Operator</option>
                  <option value="peralatan">Peralatan</option>
                </select>
                {errors.filterBy?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Kolom ini harus ditentukan</p>}
              </div>
              <div className="flex flex-col w-full gap-1">
                {watch("filterBy") === "operator" && (
                  <>
                    <label className="font-semibold" htmlFor="filterValue">
                      Nama Operator
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      defaultValue="default"
                      id="filterValue"
                      className="w-full min-w-[12rem] px-3 py-2 pr-10 text-black transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none select-add-icon focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50"
                      {...register("filterValue", { required: true })}
                    >
                      <option value="default">Silahkan pilih...</option>
                      <option value="1">Pelda. A</option>
                      <option value="2">Pelda. B</option>
                      <option value="3">Pelda. C</option>
                      <option value="4">Pelda. D</option>
                    </select>
                    {errors.filterValue?.type === "required" && <p className="w-full text-sm font-medium text-red-500">Kolom ini harus ditentukan</p>}
                  </>
                )}

                {watch("filterBy") === "peralatan" && (
                  <>
                    <label className="font-semibold" htmlFor="filterValue">
                      Nama Peralatan
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="filterValue"
                      className="max-w-sm min-w-[12rem] px-3 py-2 pr-10 text-black transition bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none select-add-icon focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-50"
                      {...register("filterValue", { required: true })}
                    >
                      <option value="default">Silahkan pilih...</option>
                      <option value="1">Alat A</option>
                      <option value="2">Alat B</option>
                    </select>
                  </>
                )}
              </div>
            </div>
          )
        }
        <div className="flex items-center justify-end w-full mt-5">
          <button className="px-5 py-2 font-semibold text-white transition rounded-lg bg-tni-accented hover:bg-tni-accented-darker" type="submit">
            Cetak Laporan
          </button>
        </div>
      </form>
    </DashLayout>
  );
}
