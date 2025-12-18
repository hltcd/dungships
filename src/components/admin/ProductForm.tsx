"use client";

import { createProduct, updateProduct } from "@/actions/products";
import { Product } from "@prisma/client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "./FileUpload";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for uploads
  const [image, setImage] = useState(product?.image || "");
  const [link, setLink] = useState(product?.link || "");
  const [gallery, setGallery] = useState<string[]>(product?.gallery || []);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    // Append uploaded values
    formData.set("image", image);
    formData.set("link", link);
    formData.set("gallery", gallery.join("\n"));

    const action = product ? updateProduct.bind(null, product.id) : createProduct;
// ... existing code ...

    const result = await action(formData);
    
    // If validation error or DB error
    if (result && 'error' in result) {
        if (typeof result.error === 'string') {
            setError(result.error);
        } else {
             // Handle Zod flattened errors - simplified for now
             setError("Please check your inputs. Ensure all fields are valid.");
        }
        setIsLoading(false);
    }
  }

  // Pre-fill helpers
  const defaultTags = product?.tags.join(", ") || "";
  const defaultFeatures = product?.features.join("\n") || "";
  const defaultGallery = product?.gallery.join("\n") || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
          <Link href="/admin/products" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
             <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {product ? "Update Product" : "Create Product"}
          </button>
      </div>

      {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
              {error}
          </div>
      )}

      {/* Basic Info */}
      <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Title</label>
                <input 
                    name="title" 
                    defaultValue={product?.title}
                    placeholder="e.g. Next.js Super Course"
                    required
                    className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Slug</label>
                <input 
                    name="slug" 
                    defaultValue={product?.slug}
                    placeholder="nextjs-super-course"
                    required
                    className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Short Description</label>
            <textarea 
                name="description" 
                defaultValue={product?.description}
                placeholder="Brief summary for cards..."
                required
                rows={3}
                className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
        </div>

         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Long Description (Markdown)</label>
            <textarea 
                name="longDescription" 
                defaultValue={product?.longDescription || ""}
                placeholder="# Detailed content..."
                rows={10}
                className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
            />
        </div>
      </div>

       {/* Pricing & Link */}
       <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Pricing & Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PriceInput 
                name="price"
                label="Price (VND)"
                defaultValue={product?.price}
                placeholder="0"
                required
            />
            <PriceInput 
                name="originalPrice"
                label="Original Price (VND)"
                defaultValue={product?.originalPrice}
                placeholder="Optional"
            />
        </div>
        
        <div className="space-y-2">
             <div className="space-y-2">
                <input name="link" type="hidden" value={link} />
                <FileUpload 
                  label="Source Code (Zip/Rar)" 
                  value={link} 
                  onChange={setLink}
                  accept=".zip,.rar,.7z"
                  type="file"
                />
            </div>
        </div>
      </div>

      {/* Media & Details */}
      <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Media & Details</h2>
        
        <div className="space-y-2">
            <input name="image" type="hidden" value={image} />
            <FileUpload 
              label="Product Image" 
              value={image} 
              onChange={setImage}
              accept="image/*"
              type="image"
            />
        </div>

        <div className="space-y-4">
            <input name="gallery" type="hidden" />
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-400">Gallery Images</label>
                <span className="text-xs text-gray-500">{gallery.length} images</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-700 bg-gray-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={img} 
                            alt={`Gallery ${idx}`} 
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={async () => {
                                // Optimistically remove
                                const newGallery = gallery.filter((_, i) => i !== idx);
                                setGallery(newGallery);
                                
                                // Call DELETE API
                                try {
                                    await fetch("/api/upload", {
                                        method: "DELETE",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ key: img })
                                    });
                                } catch (e) {
                                    console.error("Failed to delete gallery image", e);
                                }
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                
                {/* Add New Image Button */}
                <div className="aspect-square">
                    <FileUpload 
                        label="Add Image" 
                        value="" 
                        onChange={(url) => setGallery([...gallery, url])} 
                        accept="image/*"
                        type="image"
                    />
                </div>
            </div>
        </div>

         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Features (One feature per line)</label>
            <textarea 
                name="features" 
                defaultValue={defaultFeatures}
                rows={5}
                placeholder="Next.js 15 Support&#10;TypeScript Ready&#10;Dark Mode"
                className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Tags (Comma separated)</label>
            <input 
                name="tags" 
                defaultValue={defaultTags}
                placeholder="React, Next.js, UI Kit"
                className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
      </div>
    </form>
  );
}

function PriceInput({ name, label, defaultValue, placeholder, required = false }: { name: string, label: string, defaultValue?: number | null, placeholder?: string, required?: boolean }) {
    const [rawValue, setRawValue] = useState(defaultValue?.toString() || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "");
        setRawValue(val);
    };

    const displayValue = rawValue ? parseInt(rawValue).toLocaleString('vi-VN') : "";

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <input type="hidden" name={name} value={rawValue} />
            <input
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                required={required && !rawValue} 
                className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
    );
}
