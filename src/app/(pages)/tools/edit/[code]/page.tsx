import { Metadata, ResolvingMetadata } from "next";
import EditToolSection from "@/components/functional/EditToolsSection";

export async function generateMetadata({
  params: {
    code,
  },
  parent
}: {
  params: {
    code: string;
  },
  parent: ResolvingMetadata
}): Promise<Metadata> {
  const toolCode = code;

  return {
    title: `Edit Alat - ${toolCode}`,
    description: `Edit Alat - ${toolCode}`,
  };
}

export default function AddTool({
  params: {
    code,
  }
}: {
  params: {
    code: string;
  }
}) {

  return (
    <section className="w-full max-w-4xl px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Edit Peralatan</h1>
      <EditToolSection code={code} />
    </section>
  );
}
