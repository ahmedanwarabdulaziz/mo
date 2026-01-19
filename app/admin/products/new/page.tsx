import ProductForm from "@/components/admin/product-form";
import { getCategories } from "@/lib/actions/categories";

export const dynamic = 'force-dynamic';


export default async function NewProductPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">New Product</h1>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
