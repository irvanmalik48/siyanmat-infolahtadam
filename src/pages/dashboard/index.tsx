import CardLink from "@/components/CardLink";
import TableSection from "@/components/TableSection";
import DashLayout from "@/components/DashLayout";
import { Activity, Laptop, Printer } from "lucide-react";
import { useSession } from "next-auth/react";
import { requireAuth } from "@/common/requireAuth";

export const getServerSideProps = requireAuth(async () => {
  return {
    props: {},
  };
});

export default function Dashboard() {
  const session = useSession();

  return (
    <DashLayout
      title="Dashboard"
      description="Dashboard page SIYANMAT"
    >
      <h1 className="text-4xl font-bold">
        Apa yang ingin anda lakukan hari ini?
      </h1>
      <p>
        Session will be expired at: {new Date(session.data?.expires as string).toLocaleString("id-id")}
      </p>
      <nav id="quick-menu" className="flex flex-col flex-wrap w-full gap-5 py-5 md:flex-row">
        <CardLink
          href="/kegiatan"
          title="Atur Kegiatan"
          icon={<Activity size={56} />}
          description="Monitor kegiatan yang akan/sedang/sudah dilaksanakan."
        />
        <CardLink
          href="/peralatan"
          title="Atur Peralatan"
          icon={<Laptop size={56} />}
          description="Monitor umur, pengadaan, dan pemanfaatan dari peralatan yang tersedia."
        />
        <CardLink
          href="/cetak"
          title="Cetak Laporan"
          icon={<Printer size={56} />}
          description="Cetak berbagai macam laporan berkaitan dengan kegiatan serta peralatan."
        />
      </nav>
      <h1 className="mt-5 text-3xl font-bold">
        Aktivitas Terbaru
      </h1>
      <TableSection>
        <thead className="text-white bg-tni-darker">
          <tr>
            <th className="w-[5%] px-5 py-3 text-lg font-bold text-left">
              No.
            </th>
            <th className="w-[15%] px-5 py-3 text-lg font-bold text-left">
              Waktu
            </th>
            <th className="w-[40%] px-5 py-3 text-lg font-bold text-left">
              Aktivitas
            </th>
            <th className="w-[20%] px-5 py-3 text-lg font-bold text-left">
              User
            </th>
            <th className="w-[10%] px-5 py-3 text-lg font-bold text-left">
              ID Kegiatan
            </th>
            <th className="w-[10%] px-5 py-3 text-lg font-bold text-left">
              ID Peralatan
            </th>
          </tr>
        </thead>
        <tbody className="w-full divide-y divide-gray-300">
          <tr className="w-full odd:bg-neutral-100">
            <td className="px-5 py-3 text-lg font-semibold text-left">
              01
            </td>
            <td className="px-5 py-3 text-lg font-semibold text-left">
              2021-08-01 12:00:00
            </td>
            <td className="px-5 py-3 text-lg font-semibold text-left">
              Menambahkan kegiatan baru
            </td>
            <td className="px-5 py-3 text-lg font-semibold text-left">
              Administrator
            </td>
            <td className="px-5 py-3 text-lg font-semibold text-left">
              K-001
            </td>
            <td className="px-5 py-3 text-lg font-semibold text-left">
              N/A
            </td>
          </tr>
        </tbody>
      </TableSection>
    </DashLayout>
  );
}