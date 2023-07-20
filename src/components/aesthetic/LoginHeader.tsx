import Image from "next/image";
import Logo from "@/assets/logo.webp";
import InfolahtadamLogo from "@/assets/logo-infolahtadam.webp";

export default function LoginHeader() {
  return (
    <section className="grid w-full grid-cols-1 place-content-center px-5 py-8">
      <div className="flex w-full items-center justify-center gap-5">
        <div className="flex w-auto items-center justify-center md:w-36">
          <Image
            src={Logo}
            alt="Kodam II/Sriwijaya Logo"
            className="w-12 md:w-16"
          />
        </div>
        <article className="flex flex-col items-center justify-center md:gap-1">
          <h1 className="text-lg font-bold md:text-3xl">
            Aplikasi Pelayanan Materiil
          </h1>
          <p className="font-semibold md:text-lg">Infolahtadam II/Sriwijaya</p>
        </article>
        <Image
          src={InfolahtadamLogo}
          alt="Infolahtadam II/Sriwijaya Logo"
          className="w-28 md:w-36"
        />
      </div>
      <p className="w-full text-center text-4xl font-bold">SIYANMAT</p>
    </section>
  );
}
