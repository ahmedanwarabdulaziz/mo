import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <div className="text-center">
                <h1 className="text-7xl font-bold mb-4">MO3D</h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
                    Select Your Language / اختر لغتك
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                        href="/en"
                        className="group relative overflow-hidden px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:scale-105 transition-transform shadow-xl"
                    >
                        <div className="relative z-10">
                            <div className="text-3xl font-bold mb-2">English</div>
                            <div className="text-sm opacity-90">Continue in English</div>
                        </div>
                    </Link>

                    <Link
                        href="/ar"
                        className="group relative overflow-hidden px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:scale-105 transition-transform shadow-xl"
                    >
                        <div className="relative z-10">
                            <div className="text-3xl font-bold mb-2">العربية</div>
                            <div className="text-sm opacity-90">المتابعة بالعربية</div>
                        </div>
                    </Link>
                </div>

                <Link
                    href="/admin"
                    className="inline-block mt-12 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    Admin Panel →
                </Link>
            </div>
        </div>
    );
}
