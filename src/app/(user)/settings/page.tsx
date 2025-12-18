import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Hồ Sơ Cá Nhân</h1>
        <p className="text-gray-400 mt-1">Quản lý thông tin và hiển thị của bạn</p>
      </div>

      <div className="bg-[#111118] border border-gray-800 rounded-2xl p-6 md:p-8">
        <ProfileForm user={user as any} />
      </div>
    </div>
  );
}
