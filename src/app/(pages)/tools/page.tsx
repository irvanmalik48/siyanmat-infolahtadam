import ToolsTable from "@/components/functional/ToolsTable";

export const metadata = {
  title: "Peralatan",
  description: "Manajemen Peralatan",
};

export default function Tools() {
  return (
    <section className="mx-auto w-full px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Peralatan
      </h1>
      <ToolsTable />
    </section>
  );
}
