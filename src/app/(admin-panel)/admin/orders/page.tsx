import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      course: { select: { title: true, price: true, slug: true } },
      product: { select: { title: true, price: true, slug: true } }
    }
  });

  const totalRevenue = purchases.reduce((acc, p) => {
    return acc + (p.course?.price || p.product?.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Lịch Sử Đơn Hàng</h1>
          <p className="text-gray-400 mt-1">{purchases.length} đơn hàng</p>
        </div>
        <div className="bg-[#1f1f2e] rounded-xl border border-gray-800 px-6 py-4">
          <p className="text-gray-400 text-sm">Tổng Doanh Thu</p>
          <p className="text-2xl font-black text-green-400">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-gray-400 font-medium">Order ID</th>
              <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
              <th className="text-left p-4 text-gray-400 font-medium">Item</th>
              <th className="text-left p-4 text-gray-400 font-medium">Type</th>
              <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
              <th className="text-left p-4 text-gray-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <span className="text-gray-400 font-mono text-sm">
                    {purchase.id.slice(0, 8)}...
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {purchase.user.image ? (
                      <img src={purchase.user.image} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {purchase.user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium text-sm">{purchase.user.name}</p>
                      <p className="text-gray-500 text-xs">{purchase.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-white font-medium">
                    {purchase.course?.title || purchase.product?.title}
                  </p>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    purchase.course 
                      ? "bg-green-500/10 text-green-400" 
                      : "bg-purple-500/10 text-purple-400"
                  }`}>
                    {purchase.course ? "Course" : "Product"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-green-400 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                      .format(purchase.course?.price || purchase.product?.price || 0)}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(purchase.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchases.length === 0 && (
          <div className="p-12 text-center text-gray-500">Chưa có đơn hàng nào</div>
        )}
      </div>
    </div>
  );
}
