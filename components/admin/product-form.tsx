"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, Product, LocalizedText } from "@/lib/actions/products";
import MultiImageUpload from "@/components/ui/multi-image-upload";
import SpecsEditor from "@/components/admin/specs-editor";
import VariantManager from "@/components/admin/variant-manager"; // Import
import { Category } from "@/lib/actions/categories";

interface ProductFormProps {
    initialData?: Product | null;
    categories: Category[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

    const [formData, setFormData] = useState<Omit<Product, "id" | "createdAt">>({
        name: initialData?.name || { en: "", ar: "" },
        slug: initialData?.slug || "",
        sku: initialData?.sku || "",
        price: initialData?.price || 0,
        compareAtPrice: initialData?.compareAtPrice || 0,
        costPerItem: initialData?.costPerItem || 0,
        stock: initialData?.stock || 0,
        description: initialData?.description || { en: "", ar: "" },
        categoryId: initialData?.categoryId || "",
        images: initialData?.images || [],
        tags: initialData?.tags || [],
        specs: initialData?.specs || {},
        isFeatured: initialData?.isFeatured || false,
        isArchived: initialData?.isArchived || false,
        options: initialData?.options || [], // Add options
        variants: initialData?.variants || [], // Add variants
        seoTitle: initialData?.seoTitle || { en: "", ar: "" },
        seoDescription: initialData?.seoDescription || { en: "", ar: "" },
    });

    const handleLocalizedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Pick<Product, "name" | "description" | "seoTitle" | "seoDescription">) => {
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
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                await updateProduct(initialData.id, formData);
            } else {
                await createProduct(formData);
            }
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200";
    const labelClasses = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Multilingual & Core Details */}
                <div className="lg:col-span-2 space-y-8">
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

                        <div className={`space-y-4 ${activeTab === 'ar' ? 'text-right' : ''}`}>
                            <div>
                                <label className={labelClasses}>Product Name</label>
                                <input
                                    value={formData.name[activeTab]}
                                    onChange={(e) => handleLocalizedChange(e, 'name')}
                                    required={activeTab === 'en'}
                                    className={inputClasses}
                                    placeholder={activeTab === 'en' ? "e.g. Ender 3 V3" : "مثال: اندر 3"}
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Description</label>
                                <textarea
                                    value={formData.description[activeTab]}
                                    onChange={(e) => handleLocalizedChange(e, 'description')}
                                    rows={6}
                                    className={inputClasses}
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Pricing</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelClasses}>Price</label>
                                <input name="price" type="number" value={formData.price} onChange={handleChange} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Compare At</label>
                                <input name="compareAtPrice" type="number" value={formData.compareAtPrice} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Cost Per Item</label>
                                <input name="costPerItem" type="number" value={formData.costPerItem} onChange={handleChange} className={inputClasses} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Media (Shared)</h3>
                        <MultiImageUpload
                            value={formData.images}
                            onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Inventory</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>SKU</label>
                                <input name="sku" value={formData.sku} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Stock</label>
                                <input name="stock" type="number" value={formData.stock} onChange={handleChange} required className={inputClasses} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Organization */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Organization</h3>
                        <div>
                            <label className={labelClasses}>Slug (URL)</label>
                            <input name="slug" value={formData.slug} onChange={handleChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Category</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className={inputClasses}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name.en}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} id="feat" className="w-4 h-4 rounded border-slate-300 text-blueblack-900 focus:ring-blueblack-500" />
                                <label htmlFor="feat" className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured Product</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isArchived" checked={formData.isArchived} onChange={handleChange} id="arch" className="w-4 h-4 rounded border-slate-300 text-blueblack-900 focus:ring-blueblack-500" />
                                <label htmlFor="arch" className="text-sm font-medium text-slate-700 dark:text-slate-300">Archived</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Specifications</h3>
                        <SpecsEditor
                            value={formData.specs}
                            onChange={(newSpecs) => setFormData(prev => ({ ...prev, specs: newSpecs }))}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">Variants (Optional)</h3>
                        <VariantManager
                            options={formData.options || []}
                            variants={formData.variants || []}
                            basePrice={formData.price}
                            baseStock={formData.stock}
                            onOptionsChange={(newOptions) => setFormData(prev => ({ ...prev, options: newOptions }))}
                            onVariantsChange={(newVariants) => setFormData(prev => ({ ...prev, variants: newVariants }))}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-lg font-medium">SEO ({activeTab.toUpperCase()})</h3>
                        <div className={`space-y-4 ${activeTab === 'ar' ? 'text-right' : ''}`}>
                            <div>
                                <label className={labelClasses}>SEO Title</label>
                                <input
                                    value={formData.seoTitle?.[activeTab] || ""}
                                    onChange={(e) => handleLocalizedChange(e, 'seoTitle')}
                                    className={inputClasses}
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>SEO Description</label>
                                <textarea
                                    value={formData.seoDescription?.[activeTab] || ""}
                                    onChange={(e) => handleLocalizedChange(e, 'seoDescription')}
                                    rows={3}
                                    className={inputClasses}
                                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blueblack-900 hover:bg-blueblack-800 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Saving..." : (initialData ? "Save Changes" : "Create Product")}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
