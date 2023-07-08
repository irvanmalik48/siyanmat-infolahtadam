import Image from "next/image";
import Logo from "@/assets/logo.webp";
import InfolahtadamLogo from "@/assets/logo-infolahtadam.webp";

export default function LoginHeader() {
  return (
    <section className="grid w-full grid-cols-1 px-5 py-8 place-content-center">
      <div className="flex items-center justify-center w-full gap-5">
        <div className="flex items-center justify-center w-auto md:w-36">
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
          <p className="font-semibold md:text-lg">
            Infolahtadam II/Sriwijaya
          </p>
        </article>
        <Image
          src={InfolahtadamLogo}
          alt="Infolahtadam II/Sriwijaya Logo"
          className="w-28 md:w-36"
        />
      </div>
      <p className="w-full text-4xl font-bold text-center">
        SIYANMAT
      </p>
    </section>
  );
}
