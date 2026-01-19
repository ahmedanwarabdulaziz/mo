import ProductForm from "@/components/admin/product-form";
import { getCategories } from "@/lib/actions/categories";
import { getProduct } from "@/lib/actions/products";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';


interface PageProps {
    params: {
        id: string;
    }
}

export default async function EditProductPage({ params }: PageProps) {
    const product = await getProduct(params.id);
    const categories = await getCategories();

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Product</h1>
            </div>

            <ProductForm initialData={product} categories={categories} />
        </div>
    );
}
