"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return true;
        if (path !== '/admin' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blueblack-900 to-blueblack-700 dark:from-blueblack-400 dark:to-blueblack-200 bg-clip-text text-transparent">
                        AdminPanel
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/admin') ? 'bg-blueblack-50 dark:bg-blueblack-900/10 text-blueblack-900 dark:text-blueblack-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive('/admin') ? 'bg-blueblack-900 dark:bg-blueblack-400' : 'bg-transparent group-hover:bg-slate-300'}`}></span>
                        Dashboard
                    </Link>

                    <div className="pt-6 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Content
                    </div>

                    {['Categories', 'Products', 'Quotations'].map((item) => (
                        <Link key={item} href={`/admin/${item.toLowerCase()}`} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 group ${isActive(`/admin/${item.toLowerCase()}`) ? 'bg-blueblack-50 dark:bg-blueblack-900/10 text-blueblack-900 dark:text-blueblack-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive(`/admin/${item.toLowerCase()}`) ? 'bg-blueblack-900 dark:bg-blueblack-400' : 'bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-slate-600'}`}></span>
                            {item}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-white dark:bg-slate-950">
                <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
