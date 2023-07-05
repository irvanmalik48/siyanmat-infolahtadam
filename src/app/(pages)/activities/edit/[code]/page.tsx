import { Metadata, ResolvingMetadata } from "next";
import EditActivitySection from "@/components/functional/EditActivitySection";

export async function generateMetadata({
  params: {
    code,
  }
}: {
  params: {
    code: string;
  },
},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const toolCode = code;

  return {
    title: `Edit Kegiatan - ${toolCode}`,
    description: `Edit Kegiatan - ${toolCode}`,
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
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Edit Kegiatan</h1>
      <EditActivitySection code={code} />
    </section>
  );
}
