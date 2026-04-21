import { useState } from "react";

const categories = ["General", "Service", "Academic", "Technical", "Other"];

function ComplaintForm({ onSubmit, isSubmitting, disabled }) {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    if (!message.trim()) {
      setValidationError("Complaint message cannot be empty.");
      return;
    }

    await onSubmit(message.trim(), category);
    setMessage("");
    setCategory(categories[0]);
  };

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="mb-1 text-xl font-semibold text-slate-900">Submit Complaint / Feedback</h2>
      <p className="mb-4 text-sm text-slate-500">
        Your wallet address is shown in shortened format to keep submissions semi-anonymous.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your complaint or feedback..."
            className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {validationError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {validationError}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {disabled ? "Connect wallet to submit" : isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
}

export default ComplaintForm;
