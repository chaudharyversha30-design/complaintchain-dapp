import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintList from "./components/ComplaintList";
import Footer from "./components/Footer";
import SwitchToSepoliaButton from "./components/SwitchToSepoliaButton";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./utils/contractConfig";

function App() {
  const [account, setAccount] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [adminAddress, setAdminAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasMetaMask = typeof window !== "undefined" && window.ethereum;
  const isAddressConfigured = CONTRACT_ADDRESS.startsWith("0x");
  const isAdmin = useMemo(
    () =>
      account &&
      adminAddress &&
      account.toLowerCase() === adminAddress.toLowerCase(),
    [account, adminAddress]
  );
  const openComplaints = complaints.filter((item) => !item.resolved).length;
  const resolvedComplaints = complaints.length - openComplaints;

  const getContract = async (withSigner = false) => {
    if (!hasMetaMask) {
      throw new Error("MetaMask is not installed.");
    }
    if (!isAddressConfigured) {
      throw new Error("Please set your deployed contract address in contractConfig.js");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signerOrProvider = withSigner ? await provider.getSigner() : provider;
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
  };

  const fetchComplaints = async () => {
    try {
      const contract = await getContract();
      const [allComplaints, currentAdmin] = await Promise.all([
        contract.getAllComplaints(),
        contract.admin(),
      ]);
      setAdminAddress(currentAdmin);
      setComplaints(
        allComplaints.map((complaint) => ({
          id: Number(complaint.id),
          message: complaint.message,
          category: complaint.category,
          sender: complaint.sender,
          timestamp: Number(complaint.timestamp),
          resolved: complaint.resolved,
        }))
      );
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load complaints.");
    }
  };

  const connectWallet = async () => {
    try {
      setError("");
      setIsConnecting(true);
      if (!hasMetaMask) {
        setError(
          "MetaMask is not available in this browser. Open this dApp in Chrome/Brave/Edge with MetaMask installed."
        );
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0] || "");
    } catch (connectError) {
      setError(connectError.message || "Wallet connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const submitComplaint = async (message, category) => {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      const contract = await getContract(true);
      const tx = await contract.submitComplaint(message, category);
      await tx.wait();
      setSuccess("Complaint submitted successfully.");
      await fetchComplaints();
    } catch (submitError) {
      setError(submitError.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsResolved = async (id) => {
    try {
      setError("");
      setSuccess("");
      setResolvingId(id);
      const contract = await getContract(true);
      const tx = await contract.markAsResolved(id);
      await tx.wait();
      setSuccess("Complaint marked as resolved.");
      await fetchComplaints();
    } catch (resolveError) {
      setError(resolveError.message || "Resolve action failed.");
    } finally {
      setResolvingId(null);
    }
  };

  useEffect(() => {
    if (!hasMetaMask || !isAddressConfigured) {
      return;
    }

    fetchComplaints();
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => setAccount(accounts[0] || ""))
      .catch(() => {});

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || "");
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [hasMetaMask, isAddressConfigured]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-100 to-slate-100">
      <Navbar account={account} onConnect={connectWallet} isConnecting={isConnecting} />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl md:p-10">
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
            Anonymous Complaint and Feedback dApp
          </h1>
          <p className="mt-3 max-w-3xl text-indigo-100">
            Submit concerns securely on Ethereum. Complaints are transparent on-chain while your
            identity is displayed in shortened format for a semi-anonymous user experience.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-indigo-100">Total</p>
              <p className="text-2xl font-bold">{complaints.length}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-indigo-100">Open</p>
              <p className="text-2xl font-bold">{openComplaints}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-indigo-100">Resolved</p>
              <p className="text-2xl font-bold">{resolvedComplaints}</p>
            </div>
          </div>
        </section>

        {!hasMetaMask && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            MetaMask is not installed. Please install it to use this dApp.
          </p>
        )}

        {hasMetaMask && !isAddressConfigured && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
            Set your deployed contract address in `frontend/src/utils/contractConfig.js` before
            using the app.
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {success}
          </p>
        )}

        <div className="mb-6">
          <SwitchToSepoliaButton />
        </div>

        <ComplaintForm
          onSubmit={submitComplaint}
          isSubmitting={isSubmitting}
          disabled={!account}
        />
        <ComplaintList
          complaints={complaints}
          isAdmin={isAdmin}
          onResolve={markAsResolved}
          resolvingId={resolvingId}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
