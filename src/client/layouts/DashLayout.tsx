import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { PageMetadata } from "../types/types";
import RootLayout from "./RootLayout";

export default function DashLayout(props: PageMetadata) {
  const location = useLocation();

  const locations = [
    {
      path: "/",
      name: "Dashboard"
    },
    {
      path: "/kegiatan",
      name: "Atur Kegiatan"
    },
    {
      path: "/kegiatan/tambah",
      name: "Tambah Kegiatan"
    },
    {
      path: "/kegiatan/edit",
      name: "Edit Kegiatan"
    },
    {
      path: "/kegiatan/detail",
      name: "Detail Kegiatan"
    },
    {
      path: "/peralatan",
      name: "Atur Peralatan"
    },
    {
      path: "/peralatan/tambah",
      name: "Tambah Peralatan"
    },
    {
      path: "/peralatan/edit",
      name: "Edit Peralatan"
    },
    {
      path: "/peralatan/detail",
      name: "Detail Peralatan"
    },
    {
      path: "/cetak",
      name: "Cetak Laporan"
    },
  ]

  function getLocation() {
    return locations.find((loc) => loc.path === location.pathname.split("?")[0]);
  }

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
        <section className="w-full">
          <div id="top-bar-tracker" className="w-full px-5 py-3 bg-neutral-200">
            <p className="text-lg font-bold">
              {getLocation()?.name}
            </p>
          </div>
          <div id="main-content" className="w-full px-5 py-3 my-12">
            {props.children}
          </div>
        </section>
      </div>
    </RootLayout>
  )
}