import AddToolSection from "@/components/functional/AddToolSection";

export const metadata = {
  title: "Tambah Peralatan",
  description: "Tambah Peralatan",
};

export default function AddTool() {
  return (
    <section className="w-full max-w-4xl px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Tambah Peralatan Baru</h1>
      <AddToolSection />
    </section>
  );
}
