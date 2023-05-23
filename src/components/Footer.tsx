import Logo from "@/assets/logo.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-tni-dark">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <section className="grid content-start justify-center w-full px-5 py-12">
          <div className="flex flex-col items-start justify-center w-full gap-8 text-center md:text-start lg:flex-row">
            <Image src={Logo} className="w-24 mx-auto md:mx-0" alt="logo kodam" />
            <div className="flex flex-col w-full gap-2 text-white">
              <h1 className="text-lg font-bold md:text-2xl text-tni-gold">
                Infolahtadam Kodam II/Sriwijaya
              </h1>
              <p className="flex flex-col">
                <span>
                  Markas Kodam II/Sriwijaya
                </span>
                <span>
                  Jl. Jenderal Sudirman KM 3.5
                </span>
                <span>
                  Palembang, Sumatera Selatan
                </span>
                <span>
                  Telephone: (0711) 312255-312181
                </span>
                <span>
                  Fax: (0711) 312563-310488
                </span>
              </p>
            </div>
          </div>
        </section>
        <section className="grid content-start justify-center w-full px-5 py-12 bg-tni-darker">
          <nav className="grid grid-cols-1 text-center md:text-start lg:grid-cols-[auto_auto_auto] gap-8">
            <div className="flex flex-col gap-2 text-white">
              <h1 className="text-lg font-semibold text-tni-gold">
                Link Terkait
              </h1>
              <a href="https://www.kodam-ii-sriwijaya.mil.id/" className="transition underline-offset-4 hover:text-green-400">
                Official Website
              </a>
            </div>
            <div className="flex flex-col gap-2 text-white">
              <h1 className="text-lg font-semibold text-tni-gold">
                Kodam II/Sriwijaya
              </h1>
              <a href="https://www.kodam-ii-sriwijaya.mil.id/index.php?module=content&id=57" className="transition underline-offset-4 hover:text-green-400">
                Norma
              </a>
              <a href="https://www.kodam-ii-sriwijaya.mil.id/index.php?module=content&id=49" className="transition underline-offset-4 hover:text-green-400">
                Struktur
              </a>
              <a href="https://www.kodam-ii-sriwijaya.mil.id/index.php?module=content&id=70" className="transition underline-offset-4 hover:text-green-400">
                Sejarah
              </a>
              <a href="https://www.kodam-ii-sriwijaya.mil.id/index.php?module=content&id=76" className="transition underline-offset-4 hover:text-green-400">
                Identitas
              </a>
              <a href="https://www.kodam-ii-sriwijaya.mil.id/index.php?module=content&id=49" className="transition underline-offset-4 hover:text-green-400">
                Satuan
              </a>
            </div>
            <p className="flex flex-col text-sm text-white">
              <span>
                Copyright 2023,
              </span>
              <span>
                Infolahtadam Kodam II/Sriwijaya
              </span>
              <span>
                All rights reserved.
              </span>
            </p>
          </nav>
        </section>
      </div>
    </footer>
  )
}