import QuickNav from "@/components/aesthetic/QuickNav";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard SIYANMAT",
};

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      <h1 className="mt-14 w-full text-4xl font-bold leading-snug">Home</h1>
      <QuickNav />
    </section>
  );
}
