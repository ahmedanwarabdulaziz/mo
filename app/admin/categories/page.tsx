import { getCategories } from "@/lib/actions/categories";
import Link from "next/link";
import Image from "next/image";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Categories</h1>
                <Link
                    href="/admin/categories/new"
                    className="bg-blueblack-900 hover:bg-blueblack-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    + Add New
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                        {cat.image ? (
                                            <Image src={cat.image} fill alt={cat.name.en} className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-300 text-xs">IMG</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                        {cat.name.en}
                                        {cat.parentId && <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">Sub</span>}
                                    </div>
                                    {cat.name.ar && <div className="text-xs text-slate-500 font-sans mt-0.5">{cat.name.ar}</div>}
                                </td>
                                <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Link href={`/admin/categories/${cat.id}`} className="text-blueblack-900 hover:text-blueblack-700 font-medium">Edit</Link>
                                    <span className="text-slate-300">|</span>
                                    <DeleteButton id={cat.id} />
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No categories found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
