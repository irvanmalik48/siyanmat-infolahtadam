import { trpc } from "@/common/trpc";
import DashLayout from "@/components/DashLayout";
import { useRouter } from "next/router";

export default function Delete() {
  const router = useRouter();
  const { slug } = router.query;

  const { mutateAsync } = trpc.deleteKegiatan.useMutation();

  async function deleteKegiatan() {
    try {
      const res = await mutateAsync({
        id: slug as string,
      });
      if (res.status === 201) {
        router.push("/kegiatan");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DashLayout
      title="Hapus Kegiatan"
      description="Konfirmasi penghapusan kegiatan"
    >
      <h1 className="text-4xl font-bold">
        Hapus Kegiatan
      </h1>
      <div className="mt-4">
        <p className="text-lg">
          Apakah Anda yakin ingin menghapus kegiatan ini?
        </p>
        <div className="flex flex-row-reverse items-center justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={() => deleteKegiatan()}
          >
            Hapus
          </button>
          <button
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
            onClick={() => router.back()}
          >
            Batal
          </button>
        </div>
      </div>
    </DashLayout>
  );
}