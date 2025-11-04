import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying SaleFixed with account:", deployer.address);

  const saleName = process.env.SALE_NAME ?? "Launchpad Sale";

  const saleFixedFactory = await ethers.getContractFactory("SaleFixed");
  const saleFixed = await saleFixedFactory.deploy(saleName);

  await saleFixed.waitForDeployment();

  const contractAddress = await saleFixed.getAddress();

  console.log(`SaleFixed deployed with saleName="${saleName}" at:`, contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
