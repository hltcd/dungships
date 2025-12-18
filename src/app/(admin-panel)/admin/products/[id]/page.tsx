
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { Edit } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage(props: PageProps) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
      where: { id: params.id }
  });

  if (!product) {
      notFound();
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <span className="bg-purple-600/20 p-2 rounded-lg text-purple-500">
                <Edit className="w-8 h-8" />
             </span>
             Edit Product
        </h1>
        <p className="text-gray-400 mt-2 ml-14">
            Update details for <span className="text-white font-bold">{product.title}</span>
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
