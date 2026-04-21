const formatTime = (unixTimestamp) =>
  new Date(unixTimestamp * 1000).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const shortenAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

function ComplaintCard({ complaint, isAdmin, onResolve, isResolving }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Complaint #{complaint.id}</p>
          <h3 className="font-semibold text-slate-900">{complaint.category}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            complaint.resolved
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {complaint.resolved ? "Resolved" : "Open"}
        </span>
      </div>

      <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
        {complaint.message}
      </p>

      <div className="space-y-1 text-xs text-slate-500">
        <p>From: {shortenAddress(complaint.sender)}</p>
        <p>Submitted: {formatTime(complaint.timestamp)}</p>
      </div>

      {isAdmin && !complaint.resolved && (
        <button
          type="button"
          onClick={() => onResolve(complaint.id)}
          disabled={isResolving}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          {isResolving ? "Resolving..." : "Mark as Resolved"}
        </button>
      )}
    </article>
  );
}

export default ComplaintCard;
