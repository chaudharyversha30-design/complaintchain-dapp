export async function switchToSepoliaNetwork() {
  if (!window.ethereum) {
    alert("MetaMask is not installed. Please install MetaMask first.");
    return { success: false, message: "MetaMask not installed." };
  }

  const sepoliaChainId = "0xaa36a7";

  try {
    // First try to switch. This works when Sepolia is already added in MetaMask.
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: sepoliaChainId }],
    });
    return { success: true, message: "Switched to Sepolia network successfully." };
  } catch (switchError) {
    // 4902 means the network has not been added to MetaMask yet.
    if (switchError?.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: sepoliaChainId,
              chainName: "Sepolia",
              rpcUrls: ["https://sepolia.infura.io/v3/53c83dbd998419f87826b2bc61c0906"],
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "SepoliaETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: sepoliaChainId }],
        });

        return { success: true, message: "Sepolia added and switched successfully." };
      } catch (addError) {
        if (addError?.code === 4001) {
          return { success: false, message: "You rejected the network request." };
        }

        return {
          success: false,
          message: addError?.message || "Could not add Sepolia network.",
        };
      }
    }

    // 4001 is the standard MetaMask code for user rejection.
    if (switchError?.code === 4001) {
      return { success: false, message: "You rejected the network switch request." };
    }

    return {
      success: false,
      message: switchError?.message || "Failed to switch network. Please try again.",
    };
  }
}
