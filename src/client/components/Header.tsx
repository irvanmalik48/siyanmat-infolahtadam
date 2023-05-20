import Logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full text-white bg-tni-dark">
      <div className="flex flex-row items-center justify-center w-full gap-5 px-5 md:gap-8 py-7">
        <img src={Logo} alt="Logo" className="w-14 md:w-20" />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-start md:text-2xl">
            Sistem Pelayanan Materiil
          </h1>
          <h2 className="text-lg font-semibold text-start md:text-2xl">
            Infolahtadam Kodam II/Sriwijaya
          </h2>
        </div>
      </div>
      <div className="flex items-center justify-center w-full px-5 py-3 bg-tni-accented md:py-5 lg:py-7 text-tni-gold">
        <h3 className="font-serif text-lg italic font-bold md:text-xl lg:text-2xl">
          Pengabdian tiada henti
        </h3>
      </div>
    </header>
  )
}