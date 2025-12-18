import { prisma } from "@/lib/prisma";
import { Shield, ShieldOff } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { purchases: true, progress: true } }
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Quản Lý Users</h1>
        <p className="text-gray-400 mt-1">{users.length} users</p>
      </div>

      {/* Table */}
      <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-gray-400 font-medium">User</th>
              <th className="text-left p-4 text-gray-400 font-medium">Role</th>
              <th className="text-left p-4 text-gray-400 font-medium">Purchases</th>
              <th className="text-left p-4 text-gray-400 font-medium">Progress</th>
              <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
              <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{user.name || "No name"}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.role === "ADMIN" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{user._count.purchases}</td>
                <td className="p-4 text-gray-300">{user._count.progress} lessons</td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className={`p-2 transition-colors ${
                        user.role === "ADMIN" 
                          ? "text-red-400 hover:text-red-300" 
                          : "text-gray-400 hover:text-green-400"
                      }`}
                      title={user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                    >
                      {user.role === "ADMIN" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
