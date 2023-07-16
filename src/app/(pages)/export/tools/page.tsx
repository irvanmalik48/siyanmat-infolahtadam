import dynamic from "next/dynamic";
const ExportToolsSection = dynamic(
  () => import("@/components/functional/ExportToolsSection"),
  { ssr: false }
);


export const metadata = {
  title: "Ekspor Laporan Peralatan",
  description: "Ekspor Laporan Peralatan",
};

export default function Tools() {
  return (
    <section className="w-full max-w-4xl px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">
        Ekspor Laporan Peralatan
      </h1>
      <ExportToolsSection />
    </section>
  );
}
