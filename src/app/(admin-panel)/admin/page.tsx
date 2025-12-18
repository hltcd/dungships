import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";

async function getStats() {
  const [userCount, courseCount, productCount, purchaseCount, recentUsers, recentPurchases] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.product.count(),
    prisma.purchase.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    }),
    prisma.purchase.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, price: true } },
        product: { select: { title: true, price: true } }
      }
    })
  ]);

  return { userCount, courseCount, productCount, purchaseCount, recentUsers, recentPurchases };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Tổng Users", value: stats.userCount, icon: Users, color: "blue" },
    { label: "Khóa Học", value: stats.courseCount, icon: BookOpen, color: "green" },
    { label: "Source Code", value: stats.productCount, icon: Package, color: "purple" },
    { label: "Đơn Hàng", value: stats.purchaseCount, icon: ShoppingCart, color: "orange" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Tổng quan hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1f1f2e] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Users Mới
            </h2>
          </div>
          <div className="divide-y divide-gray-800">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{user.name || "No name"}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === "ADMIN" 
                      ? "bg-red-500/10 text-red-400" 
                      : "bg-gray-500/10 text-gray-400"
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">Chưa có users</div>
            )}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-400" />
              Đơn Hàng Gần Đây
            </h2>
          </div>
          <div className="divide-y divide-gray-800">
            {stats.recentPurchases.map((purchase) => (
              <div key={purchase.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {purchase.course?.title || purchase.product?.title || "Unknown"}
                    </p>
                    <p className="text-gray-500 text-sm">{purchase.user.email}</p>
                  </div>
                  <span className="text-green-400 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                      .format(purchase.course?.price || purchase.product?.price || 0)}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentPurchases.length === 0 && (
              <div className="p-8 text-center text-gray-500">Chưa có đơn hàng</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
