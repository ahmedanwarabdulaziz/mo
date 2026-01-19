export default function AdminDashboard() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            {[
                { title: 'Total Users', value: '1,234', trend: '+12%' },
                { title: 'Active Courses', value: '42', trend: '+5%' },
                { title: 'Revenue', value: '$12k', trend: '+8%' },
                { title: 'Pending Reviews', value: '5', trend: '-2%' },
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                        <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {stat.trend}
                        </span>
                    </div>
                </div>
            ))}

            {/* Recent Activity */}
            <div className="md:col-span-2 lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 mt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                    <span className="text-xs">IMG</span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">New user registered</p>
                                    <p className="text-sm text-slate-500">2 minutes ago</p>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-violet-600 hover:text-violet-700">View</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
