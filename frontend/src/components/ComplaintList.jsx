import ComplaintCard from "./ComplaintCard";

function ComplaintList({ complaints, isAdmin, onResolve, resolvingId }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-slate-900">All Complaints</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {complaints.length} Total
        </span>
      </div>

      {complaints.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
          No complaints submitted yet.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {complaints
            .slice()
            .reverse()
            .map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                isAdmin={isAdmin}
                onResolve={onResolve}
                isResolving={resolvingId === complaint.id}
              />
            ))}
        </div>
      )}
    </section>
  );
}

export default ComplaintList;
