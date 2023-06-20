import Image from "next/image";
import Logo from "@/assets/logo.webp";

export default function LoginHeader() {
  return (
    <section className="grid w-full grid-cols-1 place-content-center px-5 py-8">
      <div className="flex w-full items-center justify-center gap-5">
        <Image
          src={Logo}
          alt="Kodam II/Sriwijaya Logo"
          className="w-12 md:w-16"
        />
        <article className="flex flex-col items-start justify-center md:gap-1">
          <h1 className="text-xl font-bold md:text-3xl">
            Sistem Pelayanan Materiil
          </h1>
          <p className="font-semibold md:text-xl">
            Infolahtadam Kodam II/Sriwijaya
          </p>
        </article>
      </div>
    </section>
  );
}
