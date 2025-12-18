"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toggleProductVisibility } from "@/actions/product";
import { useRouter } from "next/navigation";

interface ToggleProps {
  id: string;
  isPublished: boolean;
}

export default function ProductVisibilityToggle({ id, isPublished }: ToggleProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    const result = await toggleProductVisibility(id, !isPublished);
    if (!result.success) {
      alert("Failed to update visibility");
    }
    setLoading(false);
    // Router refresh is handled by server action revalidatePath usually, but helpful to be sure
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${
        isPublished 
          ? "text-green-500 hover:bg-green-500/10" 
          : "text-gray-500 hover:text-white hover:bg-white/10"
      }`}
      title={isPublished ? "Public (Click to Hide)" : "Hidden (Click to Show)"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPublished ? (
        <Eye className="w-4 h-4" />
      ) : (
        <EyeOff className="w-4 h-4" />
      )}
    </button>
  );
}
