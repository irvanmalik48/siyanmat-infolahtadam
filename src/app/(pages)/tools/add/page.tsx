import AddToolSection from "@/components/functional/AddToolSection";

export const metadata = {
  title: "Tambah Peralatan",
  description: "Tambah Peralatan",
};

export default function AddTool() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Tambah Peralatan Baru
      </h1>
      <AddToolSection />
    </section>
  );
}
