import Link from "next/link";
import { getQuotations, QuotationStatus } from "@/lib/actions/quotations";

export const dynamic = 'force-dynamic';

function StatusBadge({ status }: { status: QuotationStatus }) {
    const styles = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900",
        viewed: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900",
        quoted: "bg-blueblack-50 text-blueblack-900 border-blueblack-200 dark:bg-blueblack-900/20 dark:text-blueblack-400 dark:border-blueblack-900",
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900",
        rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900",
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default async function QuotationsPage() {
    const quotations = await getQuotations();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Custom Requests</h1>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {quotations.map((quote) => (
                                <tr key={quote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <StatusBadge status={quote.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{quote.customerName}</div>
                                        <div className="text-xs text-slate-500">{quote.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                                        {quote.requestDetails}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(quote.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/quotations/${quote.id}`} className="text-blueblack-900 hover:text-blueblack-700 font-medium">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {quotations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
