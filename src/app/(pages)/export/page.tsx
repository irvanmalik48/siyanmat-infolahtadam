import QuickNav from "@/components/aesthetic/QuickNavExport";

export const metadata = {
  title: "Ekspor Laporan",
  description: "Ekspor Laporan",
};

export default function Tools() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Ekspor Laporan
      </h1>
      <QuickNav />
    </section>
  );
}
