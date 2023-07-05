import ExportActivitiesSection from "@/components/functional/ExportActivitiesSection";

export const metadata = {
  title: "Ekspor Laporan Kegiatan",
  description: "Ekspor Laporan Kegiatan",
};

export default function Tools() {
  return (
    <section className="w-full max-w-4xl px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Ekspor Laporan Kegiatan</h1>
      <ExportActivitiesSection />
    </section>
  );
}
