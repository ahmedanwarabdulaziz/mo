"use client";

import { deleteCategory } from "@/lib/actions/categories";
import { useTransition } from "react";

export function DeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this category?")) {
            startTransition(async () => {
                try {
                    await deleteCategory(id);
                } catch {
                    alert("Failed to delete category. It might have subcategories.");
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
        >
            {isPending ? "..." : "Delete"}
        </button>
    );
}
