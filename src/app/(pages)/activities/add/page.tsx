import AddActivitySection from "@/components/functional/AddActivitySection";

export const metadata = {
  title: "Tambah Kegiatan",
  description: "Tambah Kegiatan",
};

export default function AddTool() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Tambah Kegiatan Baru
      </h1>
      <AddActivitySection />
    </section>
  );
}
