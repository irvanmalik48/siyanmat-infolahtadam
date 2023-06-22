import QuickNav from "@/components/aesthetic/QuickNav";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard SIYANMAT",
};

export default function Home() {
  return (
    <section className="w-full max-w-4xl px-5 mx-auto">
      <h1 className="w-full text-4xl font-bold leading-snug mt-14">Apa yang ingin anda<br />lakukan hari ini?</h1>
      <QuickNav />
    </section>
  );
}
