"use client";

import { Quotation, QuotationStatus, updateQuotationStatus, updateQuotationNotes } from "@/lib/actions/quotations";
import { useState, useTransition } from "react";
import Image from "next/image";

export default function QuotationDetailClient({ quotation }: { quotation: Quotation }) {
    const [status, setStatus] = useState<QuotationStatus>(quotation.status);
    const [notes, setNotes] = useState(quotation.adminNotes || "");
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus: QuotationStatus) => {
        setStatus(newStatus);
        startTransition(async () => {
            await updateQuotationStatus(quotation.id, newStatus);
        });
    };

    const handleNotesSave = () => {
        startTransition(async () => {
            await updateQuotationNotes(quotation.id, notes);
            alert("Notes saved");
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Left Column: Request Info */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-medium border-b border-slate-100 dark:border-slate-800 pb-4">Request Details</h3>
                    <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {quotation.requestDetails}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-medium border-b border-slate-100 dark:border-slate-800 pb-4">Reference Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {quotation.referenceImages?.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                                <Image src={url} fill alt={`Reference ${i + 1}`} className="object-cover" />
                            </div>
                        ))}
                        {(!quotation.referenceImages || quotation.referenceImages.length === 0) && (
                            <p className="text-slate-500 text-sm col-span-3 italic">No images provided.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Management */}
            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-medium">Customer Info</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="label-field">Name</label>
                            <div className="text-slate-900 dark:text-white font-medium pl-1 text-base">{quotation.customerName}</div>
                        </div>
                        <div>
                            <label className="label-field">Email</label>
                            <div className="text-slate-900 dark:text-white font-medium pl-1 text-base">{quotation.customerEmail}</div>
                        </div>
                        <div>
                            <label className="label-field">Phone</label>
                            <div className="text-slate-900 dark:text-white font-medium pl-1 text-base">{quotation.customerPhone || "N/A"}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-lg font-medium">Actions</h3>

                    <div className="space-y-3">
                        <label className="label-field">Status</label>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value as QuotationStatus)}
                            disabled={isPending}
                            className="input-field"
                        >
                            <option value="pending">Pending</option>
                            <option value="viewed">Viewed</option>
                            <option value="quoted">Quoted</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="label-field">Admin Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={6}
                            placeholder="Internal notes about price, measurements, etc."
                            className="input-field"
                        />
                        <button
                            onClick={handleNotesSave}
                            disabled={isPending}
                            className="w-full bg-blueblack-900 hover:bg-blueblack-800 text-white dark:text-slate-900 py-3.5 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Saving..." : "Save Notes"}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .input-field {
                    @apply block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blueblack-600 focus:ring-4 focus:ring-blueblack-500/10 transition-all duration-200;
                }
                .label-field {
                    @apply block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1;
                }
            `}</style>
        </div>
    );
}
