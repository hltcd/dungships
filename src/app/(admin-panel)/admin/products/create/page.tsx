
import ProductForm from "@/components/admin/ProductForm";
import { Construction } from "lucide-react";

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <span className="bg-blue-600/20 p-2 rounded-lg text-blue-500">
                <Construction className="w-8 h-8" />
             </span>
             Create New Source Code
        </h1>
        <p className="text-gray-400 mt-2 ml-14">
            Add a new high-quality source code product to the catalog.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
