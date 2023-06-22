import ToolsTable from "@/components/functional/ToolsTable";

export const metadata = {
  title: "Peralatan",
  description: "Manajemen Peralatan",
};

export default function Tools() {
  return (
    <section className="w-full px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Manajemen Peralatan</h1>
      <ToolsTable />
    </section>
  );
}
