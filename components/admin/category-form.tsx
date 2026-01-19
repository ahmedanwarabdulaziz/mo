"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, Category, LocalizedText } from "@/lib/actions/categories";
import ImageUpload from "@/components/ui/image-upload";

interface CategoryFormProps {
    initialData?: Category | null;
    categories?: Category[]; // For parent selection
}

export default function CategoryForm({ initialData, categories = [] }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

    const [formData, setFormData] = useState<Omit<Category, "id" | "createdAt">>({
        name: initialData?.name || { en: "", ar: "" },
        slug: initialData?.slug || "",
        description: initialData?.description || { en: "", ar: "" },
        parentId: initialData?.parentId || null,
        image: initialData?.image || null,
        seoTitle: initialData?.seoTitle || { en: "", ar: "" },
        seoDescription: initialData?.seoDescription || { en: "", ar: "" },
    });

    const handleLocalizedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Pick<Category, "name" | "description" | "seoTitle" | "seoDescription">) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field] as LocalizedText,
                [activeTab]: e.target.value
            }
        }));

        // Auto-generate slug from English name
        if (field === 'name' && activeTab === 'en' && !initialData) {
            const slug = e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                await updateCategory(initialData.id, formData);
            } else {
                await createCategory(formData);
            }
            router.push("/admin/categories");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-10">

            {/* Common Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Language Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                        <button
                            type="button"
                            onClick={() => setActiveTab('en')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'en' ? 'bg-white dark:bg-slate-900 shadow-sm text-blueblack-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('ar')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'ar' ? 'bg-white dark:bg-slate-900 shadow-sm text-blueblack-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Arabic (العربية)
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium flex items-center justify-between">
                            {activeTab === 'en' ? 'General Info (English)' : 'General Info (Arabic)'}
                            <span className="text-xs font-normal text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                {activeTab.toUpperCase()}
                            </span>
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div className={activeTab === 'ar' ? 'text-right' : ''}>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Name</label>
                                <input
                                    value={formData.name[activeTab]}
                                    onChange={(e) => handleLocalizedChange(e, 'name')}
                                    required={activeTab === 'en'} // Only require English name for minimal validity
                                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                                    placeholder={activeTab === 'en' ? "e.g. Filaments" : "مثال: خيوط طباعة"}
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            <div className={activeTab === 'ar' ? 'text-right' : ''}>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Description</label>
                                <textarea
                                    value={formData.description[activeTab]}
                                    onChange={(e) => handleLocalizedChange(e, 'description')}
                                    rows={4}
                                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">SEO Settings ({activeTab.toUpperCase()})</h3>
                        <div className={`grid grid-cols-1 gap-4 ${activeTab === 'ar' ? 'text-right' : ''}`}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">SEO Title</label>
                                <input
                                    value={formData.seoTitle?.[activeTab] || ""}
                                    onChange={(e) => handleLocalizedChange(e, 'seoTitle')}
                                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                                    placeholder={activeTab === 'en' ? "Leave empty to use Name" : "اتركه فارغاً لاستخدام الاسم"}
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">SEO Description</label>
                                <textarea
                                    value={formData.seoDescription?.[activeTab] || ""}
                                    onChange={(e) => handleLocalizedChange(e, 'seoDescription')}
                                    rows={3}
                                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Organization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Slug (URL)</label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Parent Category</label>
                                <select
                                    name="parentId"
                                    value={formData.parentId || ""}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.filter(c => c.id !== initialData?.id).map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name.en}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Image</h3>
                        <ImageUpload
                            value={formData.image || ""}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            onRemove={() => setFormData({ ...formData, image: null })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blueblack-900 hover:bg-blueblack-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Saving..." : (initialData ? "Save Changes" : "Create Category")}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
