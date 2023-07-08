import Footer from "@/components/aesthetic/LoginFooter";
import Breadcrumb from "@/components/functional/Breadcrumb";
import Sidebar from "@/components/functional/Sidebar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-full items-center justify-start overflow-hidden">
      <Sidebar />
      <section
        id="content"
        className="min-h-screen w-full self-stretch overflow-y-scroll"
      >
        <Breadcrumb />
        {children}
        <div className="h-28 w-full" />
        <Footer />
      </section>
    </main>
  );
}
