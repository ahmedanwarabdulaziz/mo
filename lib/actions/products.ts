"use server";

import { getAdminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export type LocalizedText = {
    en: string;
    ar: string;
};

export type ProductOption = {
    id: string;
    name: LocalizedText; // e.g. {en: "Size", ar: "المقاس"}
    values: { id: string; name: LocalizedText }[]; // e.g. [{id: "v1", name: {en: "Small", ar: "صغير"}}]
};

export type ProductVariant = {
    id: string;
    title: string; // e.g. "Size: Small / Color: Red" (Auto-generated)
    options: Record<string, string>; // { "optionId1": "valueId1", "optionId2": "valueId2" }
    price: number;
    compareAtPrice?: number;
    stock: number;
    sku?: string;
};

export type Product = {
    id: string;
    name: LocalizedText;
    slug: string;
    sku: string;
    price: number; // Base price
    compareAtPrice?: number;
    costPerItem?: number;
    stock: number; // Base stock (or total stock)
    description: LocalizedText;
    categoryId: string;
    images: string[];
    tags: string[];
    specs: Record<string, string>;
    isFeatured: boolean;
    isArchived: boolean;
    seoTitle?: LocalizedText;
    seoDescription?: LocalizedText;
    options?: ProductOption[];
    variants?: ProductVariant[];
    createdAt: string;
};

export async function getProducts() {
    const snapshot = await getAdminDb().collection("products").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        // Helper to ensure data structure compatibility
        const name = typeof data.name === 'string' ? { en: data.name, ar: '' } : data.name;
        const description = typeof data.description === 'string' ? { en: data.description, ar: '' } : data.description;

        return { id: doc.id, ...data, name, description } as Product;
    });
}

export async function getProduct(id: string) {
    const doc = await getAdminDb().collection("products").doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;

    // Helper to ensure data structure compatibility
    const name = typeof data.name === 'string' ? { en: data.name, ar: '' } : data.name;
    const description = typeof data.description === 'string' ? { en: data.description, ar: '' } : data.description;

    return { id: doc.id, ...data, name, description } as Product;
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">) {
    // Validate Slug
    const slugCheck = await getAdminDb().collection("products").where("slug", "==", data.slug).get();
    if (!slugCheck.empty) {
        throw new Error("Slug already exists");
    }

    const docRef = await getAdminDb().collection("products").add({
        ...data,
        createdAt: new Date().toISOString(),
    });

    revalidatePath("/admin/products");
    return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
    if (data.slug) {
        const slugCheck = await getAdminDb().collection("products").where("slug", "==", data.slug).get();
        if (!slugCheck.empty && slugCheck.docs[0].id !== id) {
            throw new Error("Slug already exists");
        }
    }

    await getAdminDb().collection("products").doc(id).update(data);
    revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
    await getAdminDb().collection("products").doc(id).delete();
    revalidatePath("/admin/products");
}
