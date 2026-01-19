"use server";

import { getAdminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export type QuotationStatus = 'pending' | 'viewed' | 'quoted' | 'rejected' | 'completed';

export type Quotation = {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    requestDetails: string;
    referenceImages: string[];
    status: QuotationStatus;
    adminNotes: string;
    createdAt: string;
};

export async function getQuotations() {
    const snapshot = await getAdminDb().collection("quotations").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quotation));
}

export async function getQuotation(id: string) {
    const doc = await getAdminDb().collection("quotations").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Quotation;
}

export async function updateQuotationStatus(id: string, status: QuotationStatus) {
    await getAdminDb().collection("quotations").doc(id).update({ status });
    revalidatePath("/admin/quotations");
    revalidatePath(`/admin/quotations/${id}`);
}

export async function updateQuotationNotes(id: string, adminNotes: string) {
    await getAdminDb().collection("quotations").doc(id).update({ adminNotes });
    revalidatePath(`/admin/quotations/${id}`);
}
