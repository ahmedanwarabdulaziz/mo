"use client";

import { deleteProduct } from "@/lib/actions/products"; // Import from products
import { useTransition } from "react";

export function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this product?")) {
            startTransition(async () => {
                try {
                    await deleteProduct(id);
                } catch {
                    alert("Failed to delete product.");
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
