
import ProductVisibilityToggle from "@/components/admin/ProductVisibilityToggle";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { prisma } from "@/lib/prisma";
import { Plus, Eye, Search, Edit } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ query?: string }>
}

export default async function AdminProductsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";

  const products = await prisma.product.findMany({
    where: {
        OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
        ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { reviews: true, purchases: true } }
    }
  });

  async function searchAction(formData: FormData) {
      "use server";
      const q = formData.get("query");
      redirect(`/admin/products?query=${q}`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Quản Lý Source Code</h1>
          <p className="text-gray-400 mt-1">Manage all source code products in one place.</p>
        </div>
        <Link 
            href="/admin/products/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-[#1f1f2e] p-4 rounded-xl border border-gray-800">
          <form action={searchAction} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                name="query"
                defaultValue={query}
                placeholder="Search products by title or slug..."
                className="w-full bg-[#111118] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
          </form>
      </div>

      {/* Table */}
      <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="border-b border-gray-800 bg-[#1a1a24]">
                <th className="text-left p-5 text-gray-400 font-bold text-xs uppercase tracking-wider">Product Info</th>
                <th className="text-left p-5 text-gray-400 font-bold text-xs uppercase tracking-wider">Tags</th>
                <th className="text-center p-5 text-gray-400 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="text-center p-5 text-gray-400 font-bold text-xs uppercase tracking-wider">Stats</th>
                <th className="text-right p-5 text-gray-400 font-bold text-xs uppercase tracking-wider">Price</th>
                <th className="text-right p-5 text-gray-400 font-bold text-xs uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
                {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 relative">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                        <p className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{product.title}</p>
                        <p className="text-gray-500 text-sm font-mono">/{product.slug}</p>
                        </div>
                    </div>
                    </td>
                    <td className="p-5">
                    <div className="flex gap-2 flex-wrap max-w-[200px]">
                        {product.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                            {tag}
                        </span>
                        ))}
                        {product.tags.length > 3 && (
                            <span className="text-[10px] text-gray-500 px-1 py-1">+{product.tags.length - 3}</span>
                        )}
                    </div>
                    </td>
                    <td className="p-5 text-center">
                        <ProductVisibilityToggle id={product.id} isPublished={product.isPublished} />
                    </td>
                    <td className="p-5 text-center">
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-gray-300 text-sm font-medium">{product._count.reviews} Reviews</span>
                            <span className="text-gray-500 text-xs">{product._count.purchases} Sales</span>
                        </div>
                    </td>
                    <td className="p-5 text-right">
                    <div className="flex flex-col items-end">
                        <span className="text-green-400 font-bold text-lg">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                        </span>
                        {product.originalPrice && (
                        <span className="text-gray-600 text-sm line-through decoration-gray-600">
                            {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}₫
                        </span>
                        )}
                    </div>
                    </td>
                    <td className="p-5">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                        href={`/source-code/${product.slug}`} 
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="View Live"
                        >
                        <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit"
                        >
                        <Edit className="w-4 h-4" />
                        </Link>
                        
                        <DeleteProductButton id={product.id} title={product.title} />
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {products.length === 0 && (
            <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 text-gray-500">
                    <Search className="w-8 h-8" />
                </div>
                <h3 className="text-white font-bold text-lg">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search query or create a new product.</p>
            </div>
            )}
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm">
          Showing {products.length} result(s)
      </div>
    </div>
  );
}
