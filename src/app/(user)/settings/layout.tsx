import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SettingsSidebar from "@/components/SettingsSidebar";

export default async function UserSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden md:block">
            <SettingsSidebar />
          </aside>
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
