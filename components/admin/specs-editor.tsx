"use client";

import { useState } from "react";

interface SpecsEditorProps {
    value: Record<string, string>;
    onChange: (specs: Record<string, string>) => void;
}

export default function SpecsEditor({ value, onChange }: SpecsEditorProps) {
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    const handleAdd = () => {
        if (!newKey || !newValue) return;
        onChange({ ...value, [newKey]: newValue });
        setNewKey("");
        setNewValue("");
    };

    const handleRemove = (keyToRemove: string) => {
        const newSpecs = { ...value };
        delete newSpecs[keyToRemove];
        onChange(newSpecs);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="flex-1">
                    <input
                        placeholder="Spec Name (e.g. Nozzle Temp)"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                    />
                </div>
                <div className="flex-1">
                    <input
                        placeholder="Value (e.g. 260°C)"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="bg-blueblack-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-blueblack-800 transition-colors shadow-sm"
                >
                    Add
                </button>
            </div>

            <div className="space-y-2">
                {Object.entries(value).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex gap-3 text-sm">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{key}:</span>
                            <span className="text-slate-600 dark:text-slate-400">{val}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(key)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {Object.keys(value).length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-2 italic">No specifications added yet.</p>
                )}
            </div>
        </div>
    );
}
