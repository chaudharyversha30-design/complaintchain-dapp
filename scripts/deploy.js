const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contract with account: ${deployer.address}`);

  const ComplaintSystem = await hre.ethers.getContractFactory("ComplaintSystem");
  const complaintSystem = await ComplaintSystem.deploy(deployer.address);
  await complaintSystem.waitForDeployment();

  const deployedAddress = await complaintSystem.getAddress();
  console.log(`ComplaintSystem deployed to: ${deployedAddress}`);
  console.log(`Admin address set to: ${deployer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
