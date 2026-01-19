"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    disabled?: boolean;
}

export default function MultiImageUpload({ value, onChange, disabled }: MultiImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        const newUrls: string[] = [];

        try {
            // Upload files sequentially
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    newUrls.push(data.url);
                }
            }

            onChange([...value, ...newUrls]);
        } catch (err) {
            console.error(err);
            alert("Something went wrong during upload");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    const handleSetDefault = (url: string) => {
        // Move selected image to first position
        const newOrder = [url, ...value.filter(u => u !== url)];
        onChange(newOrder);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group">
                        <Image fill src={url} alt="Product Image" className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />

                        {/* Default Badge */}
                        {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blueblack-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                                DEFAULT
                            </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            {index !== 0 && (
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleSetDefault(url)}
                                    className="bg-blueblack-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blueblack-700 transition-colors font-medium"
                                >
                                    Set as Default
                                </button>
                            )}
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => handleRemove(url)}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition-colors font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blueblack-500 transition-colors bg-slate-50 dark:bg-slate-900"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blueblack-500"></div>
                    ) : (
                        <>
                            <span className="text-4xl text-slate-400 mb-2">+</span>
                            <span className="text-xs text-slate-500">Add Images</span>
                        </>
                    )}
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
                multiple
                disabled={disabled || loading}
            />
        </div>
    );
}
