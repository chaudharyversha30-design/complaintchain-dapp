const shortenAddress = (address) => {
  if (!address) return "Connect Wallet";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

function Navbar({ account, onConnect, isConnecting }) {
  const hasMetaMask = typeof window !== "undefined" && window.ethereum;
  const handleWalletAction = () => {
    if (!hasMetaMask) {
      window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
      return;
    }
    onConnect();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 md:text-xl">ComplaintChain</h1>
          <p className="text-xs text-slate-500">Transparent complaint tracking on Sepolia</p>
        </div>
        <button
          type="button"
          onClick={handleWalletAction}
          disabled={isConnecting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          {isConnecting
            ? "Connecting..."
            : !hasMetaMask
            ? "Install MetaMask"
            : shortenAddress(account)}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
