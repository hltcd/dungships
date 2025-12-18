"use client";

import { useState } from "react";

interface PriceInputProps {
    name: string;
    label: string;
    defaultValue?: number | null;
    placeholder?: string;
    required?: boolean;
}

export default function PriceInput({ 
    name, 
    label, 
    defaultValue, 
    placeholder, 
    required = false 
}: PriceInputProps) {
    const [rawValue, setRawValue] = useState(defaultValue?.toString() || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
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
                className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
        </div>
    );
}
