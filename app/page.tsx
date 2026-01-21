export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Welcome to MO3D
            </h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                Your application is now live!
            </p>
            <a
                href="/admin"
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Go to Admin Panel
            </a>
        </div>
    );
}
