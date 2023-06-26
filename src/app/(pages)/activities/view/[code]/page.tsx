import { Metadata, ResolvingMetadata } from "next";
import ActivityDetail from "@/components/aesthetic/ActivityDetail";

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
    title: `Detail Kegiatan - ${toolCode}`,
    description: `Detail Kegiatan - ${toolCode}`,
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
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Detail Kegiatan</h1>
      <h2 className="w-full text-2xl font-semibold leading-snug">Kode: {code}</h2>
      <ActivityDetail code={code} />
    </section>
  );
}
