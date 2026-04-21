function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-sm text-slate-500 md:flex-row">
        <span>Built for coursework demo using Hardhat, Solidity, React, Tailwind, and Ethers.js</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Sepolia Testnet
        </span>
      </div>
    </footer>
  );
}

export default Footer;
