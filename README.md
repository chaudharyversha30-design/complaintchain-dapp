# Anonymous Complaint and Feedback dApp

A full-stack Ethereum application that enables users to submit complaint or feedback records on-chain, while restricting resolution actions to an authorized admin account.

## Overview

This project demonstrates a clean Web3 architecture for academic and demo use cases:

- **Smart contract layer:** Solidity + Hardhat
- **Frontend layer:** React + Vite + Tailwind CSS
- **Wallet and blockchain interaction:** MetaMask + Ethers.js

## Key Features

- MetaMask wallet connection
- Complaint/feedback submission with category selection
- Responsive complaint listing in card format
- Status indicators for `Open` and `Resolved`
- Human-readable timestamps
- Shortened wallet address display
- Admin-only complaint resolution
- Transaction loading states with success/error feedback

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Blockchain:** Ethereum
- **Smart Contract:** Solidity
- **Development Framework:** Hardhat
- **Web3 Library:** Ethers.js
- **Wallet Provider:** MetaMask

## Project Structure

```text
anonymous-complaint-dapp/
  contracts/
    ComplaintSystem.sol
  scripts/
    deploy.js
  ignition/
    .gitkeep
  test/
    .gitkeep
  frontend/
    src/
      components/
        Navbar.jsx
        ComplaintForm.jsx
        ComplaintList.jsx
        ComplaintCard.jsx
        Footer.jsx
      utils/
        contractConfig.js
        ComplaintSystemABI.json
      App.jsx
      main.jsx
      index.css
    package.json
    vite.config.js
    tailwind.config.js
    postcss.config.js
  hardhat.config.js
  .env.example
  package.json
  README.md
```

## Local Setup

### 1. Install dependencies

From the project root:

```bash
npm install
```

From the frontend directory:

```bash
cd frontend
npm install
cd ..
```

### 2. Start a local Hardhat network

```bash
npm run node
```

Keep this terminal running throughout local development.

### 3. Deploy the smart contract

In a new terminal at the project root:

```bash
npm run deploy:local
```

Expected output includes:

- `ComplaintSystem deployed to: 0x...`
- `Admin address set to: 0x...`

### 4. Configure the frontend contract address

Update `frontend/src/utils/contractConfig.js`:

```js
export const CONTRACT_ADDRESS = "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE";
```

Replace the placeholder with the deployed contract address.

### 5. Start the frontend application

```bash
cd frontend
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## MetaMask Configuration (Local Network)

Add a custom network in MetaMask with:

- **Network Name:** `Hardhat Local`
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Currency Symbol:** `ETH`

Then import one of the private keys displayed in the `npm run node` terminal.

## Admin Access Model

The deployment account is set as the contract admin:

- In `scripts/deploy.js`, the contract is deployed by `deployer.address`
- Only this address can invoke `markAsResolved`
- Non-admin users can submit and view complaints without admin privileges

## Sepolia Deployment (Optional)

1. Copy `.env.example` to `.env`
2. Configure:
   - `SEPOLIA_RPC_URL`
   - `PRIVATE_KEY`
3. Deploy:

```bash
npm run deploy:sepolia
```

## Blockchain Usage

- Complaint records are stored on-chain in the `ComplaintSystem` contract
- Each submission is an immutable Ethereum transaction
- Resolution status updates are enforced by contract-level authorization
- Events (`ComplaintSubmitted`, `ComplaintResolved`) provide transparent auditability
- The frontend reads blockchain state directly through Ethers.js (no centralized backend)

## Future Enhancements

- Pagination for large complaint histories
- Category-based filtering and search
- Unit tests for smart contract behavior
- Public deployment of frontend and contract (Sepolia/Mainnet)
- Optional off-chain encryption for enhanced message privacy
