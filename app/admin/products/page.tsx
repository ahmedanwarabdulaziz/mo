import { getProducts } from "@/lib/actions/products";
import Link from "next/link";
import Image from "next/image";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-blueblack-900 hover:bg-blueblack-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    + Add New
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                                {product.images?.[0] ? (
                                                    <Image src={product.images[0]} fill alt={product.name.en} className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-300 text-xs">IMG</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white">{product.name.en}</div>
                                                {product.name.ar && <div className="text-xs text-slate-500 font-sans">{product.name.ar}</div>}
                                                <div className="text-xs text-slate-500 mt-0.5">{product.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-900 dark:text-white">${product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.isFeatured && <span className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 text-xs px-2 py-1 rounded-full mr-2">Featured</span>}
                                        {product.isArchived && <span className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-xs px-2 py-1 rounded-full">Archived</span>}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <Link href={`/admin/products/${product.id}`} className="text-blueblack-900 hover:text-blueblack-700 font-medium">Edit</Link>
                                        <span className="text-slate-300">|</span>
                                        <DeleteProductButton id={product.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
