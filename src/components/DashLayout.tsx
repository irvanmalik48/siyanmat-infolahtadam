import Sidebar from "@/components/Sidebar";
import type { PageMetadata } from "@/types/types";
import RootLayout from "./RootLayout";
import ArtLogo from "@/assets/logo_art.png";
import Image from "next/image";
import { useRouter } from "next/router";

export default function DashLayout(props: PageMetadata) {
  const location = useRouter();

  const locations = {
    "/dashboard": "Dashboard",
    "/kegiatan": "Atur Kegiatan",
    "/kegiatan/tambah": "Tambah Kegiatan",
    "/kegiatan/edit": "Edit Kegiatan",
    "/kegiatan/detail": "Detail Kegiatan",
    "/peralatan": "Atur Peralatan",
    "/peralatan/tambah": "Tambah Peralatan",
    "/peralatan/edit": "Edit Peralatan",
    "/peralatan/detail": "Detail Peralatan",
    "/cetak": "Cetak Laporan"
  };

  return (
    <RootLayout
      title={props.title}
      description={props.description}
      keywords={props.keywords}
      image={props.image}
      canonical={props.canonical}
    >
      <div id="master-layout" className="flex">
        <Sidebar />
        <section className="relative w-full isolate">
          <Image src={ArtLogo} alt="pernak pernik" className="absolute -z-[1] hidden w-64 lg:block top-24 right-24 opacity-20" />
          <div id="top-bar-tracker" className="w-full px-5 py-3 bg-neutral-100">
            <p className="text-lg font-bold">
              {Object.keys(locations).includes(location.asPath) ? locations[location.asPath as keyof typeof locations] : "Dashboard"}
            </p>
          </div>
          <div id="main-content" className="w-full px-5 py-3 my-24">
            {props.children}
          </div>
        </section>
      </div>
    </RootLayout>
  )
}