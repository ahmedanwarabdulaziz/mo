import CategoryForm from "@/components/admin/category-form";
import { getCategories, getCategory } from "@/lib/actions/categories";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    }
}

export default async function EditCategoryPage({ params }: PageProps) {
    const category = await getCategory(params.id);
    const categories = await getCategories();

    if (!category) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Category</h1>
            </div>

            <CategoryForm initialData={category} categories={categories} />
        </div>
    );
}
