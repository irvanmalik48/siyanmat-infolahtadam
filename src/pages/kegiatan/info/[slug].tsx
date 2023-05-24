import { trpc } from "@/common/trpc";
import DashLayout from "@/components/DashLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Info() {
  const router = useRouter();
  const fetchKegiatan = trpc.getKegiatanById.useMutation();
  const fetchPeralatan = trpc.getPeralatanById.useMutation();
  const { slug } = router.query;
  const [kegiatan, setKegiatan] = useState<any>({});
  const [peralatan, setPeralatan] = useState<any>({});

  useEffect(() => {
    fetchKegiatan.mutateAsync({
      id: slug as string,
    }).then((res) => {
      setKegiatan(res.result);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      fetchPeralatan.mutateAsync({
        id: kegiatan.idPeralatan,
      }).then((res) => {
        setPeralatan(res.result);
      }).catch((err) => {
        console.log(err);
      });
    });
  }, []);

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

  return (
    <DashLayout
      title={kegiatan.namaKegiatan}
      description={`Page untuk menampilkan info kegiatan ${kegiatan.namaKegiatan}`}
    >
      <h1 className="text-4xl font-bold">
        Detail Kegiatan
      </h1>
      <h2 className="mt-2 text-sm">
        ID: {kegiatan.id}
      </h2>
      <article className="flex flex-col items-start justify-center w-full max-w-lg gap-6 mt-4">
        <div className="flex flex-col items-center justify-center w-full gap-6 lg:flex-row">
          <div className="w-full">
            <label htmlFor="namaKegiatan" className="block font-bold">
              Nama Kegiatan
            </label>
            <p id="namaKegiatan" className="w-full mt-1">
              {kegiatan.namaKegiatan}
            </p>
          </div>
          <div className="w-full">
            <label htmlFor="tglKegiatan" className="block font-bold">
              Tanggal Kegiatan
            </label>
            <p id="tglKegiatan" className="w-full mt-1">
              {new Date(kegiatan.tglKegiatan).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="keterangan" className="block font-bold">
            Keterangan
          </label>
          <p id="keterangan" className="w-full mt-1">
            {kegiatan.keterangan}
          </p>
        </div>
        <div className="w-full">
          <label htmlFor="peralatan" className="block font-bold">
            Peralatan yang digunakan
          </label>
          <div id="peralatan" className="w-full mt-1 border-2 overflow-clip rounded-xl border-neutral-300">
            <img className="object-contain w-full bg-neutral-200 aspect-video" src={peralatan.gambar} alt={
              `Gambar peralatan ${peralatan.namaPeralatan}`
            } />
            <div className="flex flex-col w-full gap-3 px-5 py-3">
              <div className="flex flex-col w-full gap-1">
                <h3 className="font-bold">
                  ID Peralatan
                </h3>
                <p>
                  {peralatan.id}
                </p>
              </div>
              <div className="flex flex-col w-full gap-1">
                <h3 className="font-bold">
                  Nama Peralatan
                </h3>
                <p>
                  {peralatan.namaPeralatan}
                </p>
              </div>
              <div className="flex flex-col w-full gap-1">
                <h3 className="font-bold">
                  Operator
                </h3>
                <p>
                  {kegiatan.operator}
                </p>
              </div>
              <div className="flex flex-col w-full gap-1">
                <h3 className="font-bold">
                  Waktu Penggunaan
                </h3>
                <p>
                  {parseToJamMenit(kegiatan.waktuGuna)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-5">
          <Link
            href={`/kegiatan/edit/${kegiatan.id}`}
            className="flex items-center justify-center order-2 w-full px-4 py-2 text-base font-medium text-white transition rounded-lg active:scale-90 bg-tni-dark hover:bg-tni-darker"
          >
            Edit
          </Link>
          <Link
            href={`/kegiatan/delete/${kegiatan.id}`}
            className="flex items-center justify-center order-1 w-full px-4 py-2 text-base font-medium text-white transition bg-red-600 rounded-lg active:scale-90 hover:bg-red-800"
          >
            Hapus
          </Link>
        </div>
      </article>
    </DashLayout >
  )
}