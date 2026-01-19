import { getQuotation } from "@/lib/actions/quotations";
import QuotationDetailClient from "@/components/admin/quotation-detail";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

import Link from "next/link";

interface PageProps {
    params: {
        id: string;
    }
}

export default async function QuotationDetailPage({ params }: PageProps) {
    const quotation = await getQuotation(params.id);

    if (!quotation) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/quotations"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    ←
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Request from {quotation.customerName}
                </h1>
            </div>

            <QuotationDetailClient quotation={quotation} />
        </div>
    );
}
