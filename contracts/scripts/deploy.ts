import * as fs from "fs";
import { ethers } from "hardhat";
import * as path from "path";

/**
 * NEXUS Protocol Deployment Script
 * Deploys to Polygon Mainnet (Chain ID: 137)
 *
 * Contracts deployed:
 * 1. StealthRegistry - Username-based stealth payments
 * 2. NexusFactory - Vault factory
 * 3. NexusVault (USDC) - USDC yield vault
 * 4. NexusVault (USDT) - USDT yield vault
 * 5. NexusVault (DAI) - DAI yield vault
 */

// Polygon Mainnet Token Addresses
const TOKENS = {
  USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
};

// Aave V3 aToken Addresses on Polygon
const ATOKENS = {
  USDC: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
  USDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
  DAI: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
};

async function main() {
  console.log("🚀 Starting NEXUS Protocol Deployment to Polygon Mainnet...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("📋 Deployment Configuration:");
  console.log("   Deployer:", deployer.address);
  console.log("   Balance:", ethers.formatEther(balance), "MATIC");
  console.log("   Network: Polygon Mainnet (Chain ID: 137)\n");

  const deployedAddresses: Record<string, string> = {};

  // 1. Deploy StealthRegistry
  console.log("1️⃣ Deploying StealthRegistry...");
  const StealthRegistry = await ethers.getContractFactory("StealthRegistry");
  const stealthRegistry = await StealthRegistry.deploy();
  await stealthRegistry.waitForDeployment();
  const stealthRegistryAddress = await stealthRegistry.getAddress();
  deployedAddresses.STEALTH_REGISTRY = stealthRegistryAddress;
  console.log("   ✅ StealthRegistry deployed to:", stealthRegistryAddress);

  // 2. Deploy NexusFactory
  console.log("\n2️⃣ Deploying NexusFactory...");
  const NexusFactory = await ethers.getContractFactory("NexusFactory");
  const nexusFactory = await NexusFactory.deploy();
  await nexusFactory.waitForDeployment();
  const nexusFactoryAddress = await nexusFactory.getAddress();
  deployedAddresses.NEXUS_FACTORY = nexusFactoryAddress;
  console.log("   ✅ NexusFactory deployed to:", nexusFactoryAddress);

  // 3. Deploy USDC Vault
  console.log("\n3️⃣ Deploying USDC Vault...");
  const NexusVault = await ethers.getContractFactory("NexusVault");
  const usdcVault = await NexusVault.deploy(
    TOKENS.USDC,
    ATOKENS.USDC,
    "Nexus USDC Vault",
    "nxUSDC",
    "Earn yield on USDC through Aave V3. Low risk, stable returns.",
    1 // Low risk
  );
  await usdcVault.waitForDeployment();
  const usdcVaultAddress = await usdcVault.getAddress();
  deployedAddresses.USDC_VAULT = usdcVaultAddress;
  console.log("   ✅ USDC Vault deployed to:", usdcVaultAddress);

  // 4. Deploy USDT Vault
  console.log("\n4️⃣ Deploying USDT Vault...");
  const usdtVault = await NexusVault.deploy(
    TOKENS.USDT,
    ATOKENS.USDT,
    "Nexus USDT Vault",
    "nxUSDT",
    "Earn yield on USDT through Aave V3. Low risk, stable returns.",
    1 // Low risk
  );
  await usdtVault.waitForDeployment();
  const usdtVaultAddress = await usdtVault.getAddress();
  deployedAddresses.USDT_VAULT = usdtVaultAddress;
  console.log("   ✅ USDT Vault deployed to:", usdtVaultAddress);

  // 5. Deploy DAI Vault
  console.log("\n5️⃣ Deploying DAI Vault...");
  const daiVault = await NexusVault.deploy(
    TOKENS.DAI,
    ATOKENS.DAI,
    "Nexus DAI Vault",
    "nxDAI",
    "Earn yield on DAI through Aave V3. Low risk, stable returns.",
    1 // Low risk
  );
  await daiVault.waitForDeployment();
  const daiVaultAddress = await daiVault.getAddress();
  deployedAddresses.DAI_VAULT = daiVaultAddress;
  console.log("   ✅ DAI Vault deployed to:", daiVaultAddress);

  // Save deployment addresses
  console.log("\n📝 Saving deployment addresses...");

  const deploymentData = {
    network: "polygon",
    chainId: 137,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: deployedAddresses,
    tokens: TOKENS,
    aTokens: ATOKENS,
  };

  // Save to deployments folder
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "polygon.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   STEALTH_REGISTRY:", deployedAddresses.STEALTH_REGISTRY);
  console.log("   NEXUS_FACTORY:", deployedAddresses.NEXUS_FACTORY);
  console.log("   USDC_VAULT:", deployedAddresses.USDC_VAULT);
  console.log("   USDT_VAULT:", deployedAddresses.USDT_VAULT);
  console.log("   DAI_VAULT:", deployedAddresses.DAI_VAULT);
  console.log("\n💾 Deployment saved to: deployments/polygon.json");
  console.log("\n🔗 Add these to your frontend .env file:");
  console.log(
    `   VITE_STEALTH_REGISTRY_ADDRESS=${deployedAddresses.STEALTH_REGISTRY}`
  );
  console.log(
    `   VITE_NEXUS_FACTORY_ADDRESS=${deployedAddresses.NEXUS_FACTORY}`
  );
  console.log(`   VITE_USDC_VAULT_ADDRESS=${deployedAddresses.USDC_VAULT}`);
  console.log(`   VITE_USDT_VAULT_ADDRESS=${deployedAddresses.USDT_VAULT}`);
  console.log(`   VITE_DAI_VAULT_ADDRESS=${deployedAddresses.DAI_VAULT}`);
  console.log("=".repeat(60));

  return deployedAddresses;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
