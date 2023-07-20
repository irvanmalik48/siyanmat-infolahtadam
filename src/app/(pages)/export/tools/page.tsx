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
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Ekspor Laporan Peralatan
      </h1>
      <ExportToolsSection />
    </section>
  );
}
