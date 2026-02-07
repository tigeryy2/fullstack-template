type AccountSummaryProps = {
    user: {
        name: string;
        plan: string;
        email?: string;
    };
    stats: {
        projects: number;
        credits: number;
        lastSyncedAt: string;
    };
};

export function AccountSummary({ user, stats }: AccountSummaryProps) {
    return (
        <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Account summary
            </h3>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        Welcome back
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        {user.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {user.email ?? "Signed in"}
                    </p>
                </div>
                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    {user.plan}
                </div>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Projects
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-slate-900">
                        {stats.projects}
                    </dd>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Credits
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-slate-900">
                        {stats.credits}
                    </dd>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Sync status
                    </dt>
                    <dd className="mt-2 text-sm font-semibold text-slate-900">
                        {stats.lastSyncedAt}
                    </dd>
                </div>
            </dl>
        </section>
    );
}
