import { Metadata, ResolvingMetadata } from "next";
import ActivityDetail from "@/components/aesthetic/ActivityDetail";

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
    title: `Detail Kegiatan - ${toolCode}`,
    description: `Detail Kegiatan - ${toolCode}`,
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
        Detail Kegiatan
      </h1>
      <h2 className="w-full text-2xl font-semibold leading-snug">
        Kode: {code}
      </h2>
      <ActivityDetail code={code} />
    </section>
  );
}
