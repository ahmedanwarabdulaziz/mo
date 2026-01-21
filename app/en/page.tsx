import Link from "next/link";
import translations from "@/translations/en.json";

export default function EnHomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {translations.home.title}
            </h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                {translations.home.subtitle}
            </p>

            <div className="flex gap-4 mt-8">
                <Link
                    href="/admin"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {translations.common.goToAdmin}
                </Link>

                <Link
                    href="/ar"
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                    {translations.common.switchLanguage}
                </Link>
            </div>
        </div>
    );
}
