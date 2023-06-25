import AddActivitySection from "@/components/functional/AddActivitySection";

export const metadata = {
  title: "Tambah Kegiatan",
  description: "Tambah Kegiatan",
};

export default function AddTool() {
  return (
    <section className="w-full max-w-4xl px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Tambah Kegiatan Baru</h1>
      <AddActivitySection />
    </section>
  );
}
