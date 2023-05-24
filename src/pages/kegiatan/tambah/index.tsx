import DashLayout from "@/components/DashLayout";
import { type IKegiatan, kegiatanSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/common/trpc";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PeralatanOptions } from "@/components/Options";
import { UUID } from "uuidjs";

export default function TambahKegiatan() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IKegiatan>({
    defaultValues: {
      namaKegiatan: "",
      tglKegiatan: new Date(),
      idPeralatan: "",
      waktuGuna: 0,
      keterangan: "",
    },
    resolver: zodResolver(kegiatanSchema),
  });

  const router = useRouter();

  const [listPeralatan, setListPeralatan] = useState<any[]>([]);

  const tambahKegiatanHandler = trpc.tambahKegiatan.useMutation();
  const getAllPeralatanHandler = trpc.getAllPeralatan.useMutation();
  const tambahMenitPemakaianHandler = trpc.tambahMenitPemakaian.useMutation();

  const onSubmit = useCallback(async (data: IKegiatan) => {
    try {
      const resOne = await tambahKegiatanHandler.mutateAsync({
        ...data,
        tglKegiatan: (new Date(data.tglKegiatan)).toISOString(),
        waktuGuna: (parseInt(data.waktuGuna.toString())),
      });
      const resTwo = await tambahMenitPemakaianHandler.mutateAsync({
        id: data.idPeralatan,
        menitPemakaian: (parseInt(data.waktuGuna.toString())),
      });
      if (resOne.status === 201 && resTwo.status === 201) {
        reset();
        router.push("/kegiatan");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllPeralatanHandler.mutateAsync().then((res) => {
      setListPeralatan(res.result);
    });
  }, []);

  return (
    <DashLayout
      title="Tambah Kegiatan"
      description="Page untuk menambah kegiatan"
    >
      <h1 className="text-4xl font-bold">
        Tambah Kegiatan
      </h1>
      <p className="mt-2">
        Silahkan isi form di bawah ini untuk menambah kegiatan baru.
      </p>
      <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
        <input id="id" type="text" hidden {...register("id", { required: true })} value={UUID.genV4().toString()} />
        <div className="flex flex-col items-start justify-center w-full max-w-lg gap-6">
          <div className="w-full">
            <label htmlFor="namaKegiatan" className="block text-sm font-medium">
              Nama Kegiatan
            </label>
            <div className="w-full mt-1">
              <input
                {...register("namaKegiatan", { required: true })}
                id="namaKegiatan"
                type="text"
                autoComplete="off"
                className={`w-full px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50 ${errors.namaKegiatan ? "border-red-500" : ""}`}
                placeholder="Masukkan nama kegiatan"
              />
            </div>
            {errors.namaKegiatan && <p className="mt-2 text-sm text-red-500">{errors.namaKegiatan.message}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="tglKegiatan" className="block text-sm font-medium">
              Tanggal Kegiatan
            </label>
            <input
              type="date"
              {...register("tglKegiatan", { required: true })}
              className={`w-full px-3 py-2 mt-1 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50 ${errors.tglKegiatan ? "border-red-500" : ""}`}
              id="tglKegiatan"
            />
            {errors.tglKegiatan && <p className="mt-2 text-sm text-red-500">{errors.tglKegiatan.message}</p>}
          </div>
          <div className="grid w-full grid-cols-2 gap-5">
            <div className="w-full col-span-2 md:col-span-1">
              <label htmlFor="idPeralatan" className="block text-sm font-medium">
                Peralatan yang digunakan
              </label>
              <div className="w-full mt-1">
                <select
                  {...register("idPeralatan", { required: true })}
                  id="idPeralatan"
                  className={`w-full px-3 py-2 bg-white appearance-none select-add-icon transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50 ${errors.idPeralatan ? "border-red-500" : ""}`}
                  defaultValue={""}
                >
                  <PeralatanOptions
                    list={listPeralatan}
                    defaultValue="Pilih peralatan"
                  />
                </select>
              </div>
              {errors.idPeralatan && <p className="mt-2 text-sm text-red-500">{errors.idPeralatan.message}</p>}
            </div>
            <div className="w-full col-span-2 md:col-span-1">
              <label htmlFor="waktuGuna" className="block text-sm font-medium">
                Waktu Guna (satuan menit)
              </label>
              <div className="w-full mt-1">
                <input
                  {...register("waktuGuna", { required: true })}
                  id="waktuGuna"
                  type="number"
                  autoComplete="off"
                  className={`w-full px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50 ${errors.waktuGuna ? "border-red-500" : ""}`}
                  placeholder="Masukkan waktu guna"
                />
              </div>
              {errors.waktuGuna && <p className="mt-2 text-sm text-red-500">{errors.waktuGuna.message}</p>}
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="operator" className="block text-sm font-medium">
              Operator
            </label>
            <div className="w-full mt-1">
              <input
                {...register("operator", { required: true })}
                id="operator"
                type="text"
                autoComplete="off"
                className={`w-full px-3 py-2 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50 ${errors.operator ? "border-red-500" : ""}`}
                placeholder="Masukkan nama operator"
              />
            </div>
            {errors.operator && <p className="mt-2 text-sm text-red-500">{errors.operator.message}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="keterangan" className="block text-sm font-medium">
              Keterangan
            </label>
            <div className="w-full mt-1">
              <textarea
                {...register("keterangan")}
                id="keterangan"
                className={`w-full px-3 py-2 resize-none h-48 transition border-2 border-gray-300 rounded-lg outline-none focus:border-tni-darker focus:ring-4 focus:ring-tni-accented focus:ring-opacity-50 ${errors.keterangan ? "border-red-500" : ""}`}
                placeholder="Masukkan keterangan"
              />
            </div>
            {errors.keterangan && <p className="mt-2 text-sm text-red-500">{errors.keterangan.message}</p>}
          </div>
          <div className="grid w-full grid-cols-2 gap-5">
            <button
              type="submit"
              className="flex items-center justify-center order-2 w-full px-4 py-2 text-base font-medium text-white transition rounded-lg active:scale-90 bg-tni-dark hover:bg-tni-darker"
            >
              Tambah
            </button>
            <button
              type="reset"
              onClick={() => reset()}
              className="flex items-center justify-center order-1 w-full px-4 py-2 text-base font-medium text-white transition bg-red-600 rounded-lg active:scale-90 hover:bg-red-800"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </DashLayout>
  );
}
