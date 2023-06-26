import ActivitiesTable from "@/components/functional/ActivitiesTable";

export const metadata = {
  title: "Kegiatan",
  description: "Manajemen Kegiatan",
};

export default function Tools() {
  return (
    <section className="w-full px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Manajemen Kegiatan</h1>
      <ActivitiesTable />
    </section>
  );
}
