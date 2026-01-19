"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export type LocalizedText = {
    en: string;
    ar: string;
};

export type Category = {
    id: string;
    name: LocalizedText;
    slug: string;
    description: LocalizedText;
    parentId: string | null;
    image: string | null;
    seoTitle?: LocalizedText;
    seoDescription?: LocalizedText;
    createdAt: string;
};

export async function getCategories() {
    const snapshot = await adminDb.collection("categories").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        // Helper to ensure data structure compatibility if migrating
        const name = typeof data.name === 'string' ? { en: data.name, ar: '' } : data.name;
        const description = typeof data.description === 'string' ? { en: data.description, ar: '' } : data.description;

        return {
            id: doc.id,
            ...data,
            name,
            description
        } as Category;
    });
}

export async function getCategory(id: string) {
    const doc = await adminDb.collection("categories").doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;

    // Helper to ensure data structure compatibility
    const name = typeof data.name === 'string' ? { en: data.name, ar: '' } : data.name;
    const description = typeof data.description === 'string' ? { en: data.description, ar: '' } : data.description;

    return { id: doc.id, ...data, name, description } as Category;
}

export async function createCategory(data: Omit<Category, "id" | "createdAt">) {
    // Validate Slug Uniqueness
    const slugCheck = await adminDb.collection("categories").where("slug", "==", data.slug).get();
    if (!slugCheck.empty) {
        throw new Error("Slug already exists");
    }

    const docRef = await adminDb.collection("categories").add({
        ...data,
        createdAt: new Date().toISOString(),
    });

    revalidatePath("/admin/categories");
    return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>) {
    // Check slug if it's being changed
    if (data.slug) {
        const slugCheck = await adminDb.collection("categories").where("slug", "==", data.slug).get();
        if (!slugCheck.empty && slugCheck.docs[0].id !== id) {
            throw new Error("Slug already exists");
        }
    }

    await adminDb.collection("categories").doc(id).update(data);
    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
}

export async function deleteCategory(id: string) {
    // Check for subcategories
    const subcats = await adminDb.collection("categories").where("parentId", "==", id).get();
    if (!subcats.empty) {
        throw new Error("Cannot delete category with subcategories");
    }

    await adminDb.collection("categories").doc(id).delete();
    revalidatePath("/admin/categories");
}
