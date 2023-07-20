import ActivitiesTable from "@/components/functional/ActivitiesTable";

export const metadata = {
  title: "Kegiatan",
  description: "Manajemen Kegiatan",
};

export default function Tools() {
  return (
    <section className="mx-auto w-full px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">Kegiatan</h1>
      <ActivitiesTable />
    </section>
  );
}
