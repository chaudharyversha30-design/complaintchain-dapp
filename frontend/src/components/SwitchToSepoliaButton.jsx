import { useEffect, useState } from "react";
import { switchToSepoliaNetwork } from "../utils/switchToSepolia";

function SwitchToSepoliaButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSepolia, setIsSepolia] = useState(false);

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const result = await switchToSepoliaNetwork();
    setMessage(result.message);
    setIsError(!result.success);
    if (result.success) {
      setIsSepolia(true);
    }
    setIsLoading(false);
  };

  const checkCurrentNetwork = async () => {
    if (!window.ethereum) return;
    try {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      setIsSepolia(currentChainId === "0xaa36a7");
    } catch (_) {}
  };

  useEffect(() => {
    checkCurrentNetwork();
    if (!window.ethereum) return;
    const handleChainChanged = (chainId) => {
      setIsSepolia(chainId === "0xaa36a7");
    };
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => window.ethereum.removeListener("chainChanged", handleChainChanged);
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Network</p>
          <p className="text-xs text-slate-500">
            Make sure your wallet is connected to Sepolia testnet
          </p>
        </div>
        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            isSepolia ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {isSepolia ? "Sepolia Connected" : "Not on Sepolia"}
        </span>
      </div>

      <button
        type="button"
        onClick={handleSwitchNetwork}
        disabled={isLoading || isSepolia}
        className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-400"
      >
        {isLoading ? "Switching..." : isSepolia ? "Already on Sepolia" : "Switch To Sepolia"}
      </button>

      {message && (
        <p
          className={`mt-3 rounded-md px-3 py-2 text-sm ${
            isError
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default SwitchToSepoliaButton;
