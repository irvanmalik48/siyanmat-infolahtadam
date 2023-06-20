import Footer from "@/components/aesthetic/LoginFooter";
import Breadcrumb from "@/components/functional/Breadcrumb";
import Sidebar from "@/components/functional/Sidebar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-start w-full h-screen overflow-hidden">
      <Sidebar />
      <section
        id="content"
        className="self-stretch w-full min-h-screen overflow-y-scroll"
      >
        <Breadcrumb />
        {children}
        <div className="w-full h-28" />
        <Footer />
      </section>
    </main>
  );
}
