"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                onChange(data.url);
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group">
                        <Image fill src={value} alt="Upload" className="object-cover" sizes="160px" />
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => onRemove ? onRemove() : onChange("")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            X
                        </button>
                    </div>
                ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blueblack-500 transition-colors bg-slate-50 dark:bg-slate-900">
                        {loading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blueblack-500"></div>
                        ) : (
                            <>
                                <span className="text-4xl text-slate-400 mb-2">+</span>
                                <span className="text-sm text-slate-500">Upload Image</span>
                            </>
                        )}
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
                disabled={disabled || loading}
            />
        </div>
    );
}
