"use client";

import { useState } from "react";
import { ProductOption, ProductVariant } from "@/lib/actions/products";
import { v4 as uuidv4 } from 'uuid';

interface VariantManagerProps {
    options: ProductOption[];
    variants: ProductVariant[];
    basePrice: number;
    baseStock: number;
    onOptionsChange: (options: ProductOption[]) => void;
    onVariantsChange: (variants: ProductVariant[]) => void;
}

export default function VariantManager({
    options,
    variants,
    basePrice,
    baseStock,
    onOptionsChange,
    onVariantsChange
}: VariantManagerProps) {
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

    // -- Handler for Options --
    const addOption = () => {
        const newOption: ProductOption = {
            id: uuidv4(),
            name: { en: "", ar: "" },
            values: []
        };
        onOptionsChange([...options, newOption]);
    };

    const removeOption = (optionId: string) => {
        onOptionsChange(options.filter(o => o.id !== optionId));
        // Also clear variants as they are invalid now
        onVariantsChange([]);
    };

    const updateOptionName = (optionId: string, value: string) => {
        onOptionsChange(options.map(o =>
            o.id === optionId ? { ...o, name: { ...o.name, [activeTab]: value } } : o
        ));
    };

    const addValue = (optionId: string) => {
        onOptionsChange(options.map(o => {
            if (o.id !== optionId) return o;
            return {
                ...o,
                values: [...o.values, { id: uuidv4(), name: { en: "", ar: "" } }]
            };
        }));
    };

    const removeValue = (optionId: string, valueId: string) => {
        onOptionsChange(options.map(o => {
            if (o.id !== optionId) return o;
            return {
                ...o,
                values: o.values.filter(v => v.id !== valueId)
            };
        }));
    };

    const updateValueName = (optionId: string, valueId: string, newValue: string) => {
        onOptionsChange(options.map(o => {
            if (o.id !== optionId) return o;
            return {
                ...o,
                values: o.values.map(v =>
                    v.id === valueId ? { ...v, name: { ...v.name, [activeTab]: newValue } } : v
                )
            };
        }));
    };

    // -- Handler for Variants Generation --
    const generateVariants = () => {
        if (options.length === 0) return;

        // Recursive function to generate cartesian product
        const cartesian = (args: unknown[][]): unknown[][] => {
            const r: unknown[][] = [], max = args.length - 1;
            function helper(arr: unknown[], i: number) {
                for (let j = 0, l = args[i].length; j < l; j++) {
                    const a = arr.slice(0); // clone arr
                    a.push(args[i][j]);
                    if (i == max) r.push(a);
                    else helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        };

        // Prepare arrays of values for cartesian product
        const valueArrays = options.map(opt => opt.values.map(val => ({ optionId: opt.id, valueId: val.id, valueName: val.name })));

        // If any option has no values, we can't generate variants
        if (valueArrays.some(arr => arr.length === 0)) {
            alert("Please add at least one value for every option.");
            return;
        }

        const combinations = cartesian(valueArrays);

        const newVariants: ProductVariant[] = combinations.map(combo => {
            const variantOptions: Record<string, string> = {};
            const titleParts: string[] = [];

            combo.forEach((c) => {
                const item = c as { optionId: string; valueId: string; valueName: { en: string; ar: string } };
                variantOptions[item.optionId] = item.valueId;
                titleParts.push(item.valueName['en']); // Use English for internal title usually
            });

            return {
                id: uuidv4(),
                title: titleParts.join(" / "),
                options: variantOptions,
                price: basePrice,
                stock: baseStock,
                sku: ""
            };
        });

        onVariantsChange(newVariants);
    };

    // -- Handler for Variant Updates --
    const updateVariant = (variantId: string, field: keyof ProductVariant, val: string | number) => {
        onVariantsChange(variants.map(v =>
            v.id === variantId ? { ...v, [field]: val } : v
        ));
    };

    const inputClasses = "block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200";
    const labelClasses = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1";

    return (
        <div className="space-y-8">
            {/* Language Toggle */}
            <div className="flex justify-end">
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
                        Arabic
                    </button>
                </div>
            </div>

            {/* 1. Define Options */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium">1. Product Options</h4>
                    <button type="button" onClick={addOption} className="text-sm text-blueblack-600 font-medium hover:underline">+ Add Option</button>
                </div>

                {options.length === 0 && <p className="text-sm text-slate-400 italic">No options defined (e.g. Size, Color).</p>}

                {options.map((option) => (
                    <div key={option.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30">
                        <div className="mb-4">
                            <label className={labelClasses}>Option Name ({activeTab})</label>
                            <div className="flex gap-2">
                                <input
                                    value={option.name[activeTab]}
                                    onChange={(e) => updateOptionName(option.id, e.target.value)}
                                    placeholder={activeTab === 'en' ? "e.g. Size" : "مثال: المقاس"}
                                    className={inputClasses}
                                />
                                <button type="button" onClick={() => removeOption(option.id)} className="text-red-500 px-2 font-bold text-xl hover:bg-slate-100 rounded">×</button>
                            </div>
                        </div>

                        <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                            <label className={labelClasses}>Option Values</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {option.values.map(val => (
                                    <div key={val.id} className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-1 py-1 shadow-sm">
                                        <input
                                            value={val.name[activeTab]}
                                            onChange={(e) => updateValueName(option.id, val.id, e.target.value)}
                                            placeholder="Value"
                                            className="bg-transparent outline-none text-sm w-24"
                                            autoFocus
                                        />
                                        <button type="button" onClick={() => removeValue(option.id, val.id)} className="text-slate-400 hover:text-red-500 p-1">×</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addValue(option.id)} className="text-sm bg-blueblack-50 text-blueblack-700 px-3 py-1 rounded-lg hover:bg-blueblack-100 transition-colors">+ Add Value</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Generate Variants */}
            {options.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-medium">2. Variants Preview</h4>
                        <button
                            type="button"
                            onClick={generateVariants}
                            className="bg-blueblack-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blueblack-800 shadow-sm"
                        >
                            Generate Variants
                        </button>
                    </div>

                    <div className="space-y-3">
                        {variants.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Click Generate to create variants based on options above.</p>
                        ) : (
                            variants.map((variant) => (
                                <div key={variant.id} className="grid grid-cols-12 gap-4 items-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                    <div className="col-span-3 text-sm font-semibold text-slate-700 dark:text-white">
                                        {variant.title}
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[10px] uppercase text-slate-400 font-bold">Price</label>
                                        <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value))}
                                            className="w-full text-sm border border-slate-300 rounded-lg px-2 py-1"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[10px] uppercase text-slate-400 font-bold">Stock</label>
                                        <input
                                            type="number"
                                            value={variant.stock}
                                            onChange={(e) => updateVariant(variant.id, 'stock', parseFloat(e.target.value))}
                                            className="w-full text-sm border border-slate-300 rounded-lg px-2 py-1"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[10px] uppercase text-slate-400 font-bold">SKU</label>
                                        <input
                                            value={variant.sku || ""}
                                            onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                            className="w-full text-sm border border-slate-300 rounded-lg px-2 py-1"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
