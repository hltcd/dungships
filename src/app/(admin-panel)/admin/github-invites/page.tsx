import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Github, Check, X, Clock, ExternalLink } from "lucide-react";
import InviteStatusButton from "@/components/admin/InviteStatusButton";

export default async function AdminGithubInvitesPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    const requests = await prisma.githubInviteRequest.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
            product: {
                select: {
                    title: true,
                    slug: true,
                    githubRepo: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const pendingCount = requests.filter(r => r.status === "PENDING").length;

    return (
        <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Github className="w-8 h-8" />
                        GitHub Invites
                    </h1>
                    <p className="text-gray-400 mt-1">Quản lý và phê duyệt yêu cầu mời vào GitHub Repository</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <div>
                        <span className="text-white font-bold">{pendingCount}</span>
                        <span className="text-xs text-yellow-500 uppercase ml-2 font-bold tracking-wider">Đang chờ</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 bg-white/5">
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Người dùng</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">GitHub Username</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày gửi</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center text-gray-500 italic">
                                    Chưa có yêu cầu nào được gửi.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{req.user.name || "N/A"}</div>
                                        <div className="text-xs text-gray-500">{req.user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <a 
                                            href={`/source-code/${req.product.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-white hover:text-blue-400 transition-colors"
                                        >
                                            {req.product.title}
                                        </a>
                                        {req.product.githubRepo ? (
                                            <a 
                                                href={`${req.product.githubRepo}/settings/access`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-1 uppercase font-bold tracking-wider"
                                            >
                                                Invite People <ExternalLink className="w-2 h-2" />
                                            </a>
                                        ) : (
                                            <div className="text-[10px] text-red-500 uppercase font-bold mt-1">Chưa gắn Repo</div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <a 
                                            href={`https://github.com/${req.githubUsername}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-white bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded-lg text-sm transition-all"
                                        >
                                            {req.githubUsername}
                                            <ExternalLink className="w-3 h-3 opacity-50" />
                                        </a>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            <StatusBadge status={req.status} />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {req.status === "PENDING" && (
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <InviteStatusButton id={req.id} status="INVITED" />
                                                <InviteStatusButton id={req.id} status="FAILED" />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "INVITED":
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                    <Check className="w-3 h-3" />
                    ĐÃ MỜI
                </span>
            );
        case "FAILED":
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                    <X className="w-3 h-3" />
                    THẤT BẠI
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                    <Clock className="w-3 h-3" />
                    CHỜ XỬ LÝ
                </span>
            );
    }
}
