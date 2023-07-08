import ExportActivitiesSection from "@/components/functional/ExportActivitiesSection";

export const metadata = {
  title: "Ekspor Laporan Kegiatan",
  description: "Ekspor Laporan Kegiatan",
};

export default function Tools() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Ekspor Laporan Kegiatan
      </h1>
      <ExportActivitiesSection />
    </section>
  );
}
