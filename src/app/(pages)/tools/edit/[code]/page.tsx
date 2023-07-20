import { Metadata, ResolvingMetadata } from "next";
import EditToolSection from "@/components/functional/EditToolsSection";

export async function generateMetadata(
  {
    params: { code },
  }: {
    params: {
      code: string;
    };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const toolCode = code;

  return {
    title: `Edit Alat - ${toolCode}`,
    description: `Edit Alat - ${toolCode}`,
  };
}

export default function AddTool({
  params: { code },
}: {
  params: {
    code: string;
  };
}) {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">
        Edit Peralatan
      </h1>
      <EditToolSection code={code} />
    </section>
  );
}
