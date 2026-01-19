import CategoryForm from "@/components/admin/category-form";
import { getCategories } from "@/lib/actions/categories";

export const dynamic = 'force-dynamic';


export default async function NewCategoryPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">New Category</h1>
            </div>

            <CategoryForm categories={categories} />
        </div>
    );
}
